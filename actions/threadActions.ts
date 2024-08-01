"use server";
import { kv } from "@vercel/kv";
import { generateHash } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { unstable_noStore as noStore } from "next/cache";
import { setTimeout } from "timers/promises";
import { retry } from "@/lib/retry";

export type QueryStatus = "pending" | "complete" | "error";

const ERROR_MESSAGES = {
  SAVE_CONTEXT: "Failed to save frontend context",
  RETRIEVE_CONTEXT: "Failed to retrieve frontend id",
  CREATE_THREAD: "Failed to create thread",
  SAVE_THREAD: "Failed to save thread",
  SAVE_CONVERSATION: "Failed to save conversation to thread",
  RETRIEVE_CONVERSATION: "Failed to retrieve conversation",
  RETRIEVE_THREAD_DATA: "Failed to retrieve thread data",
  RETRIEVE_RECENT_THREADS: "Failed to retrieve recent threads",
};

export async function saveFrontendContext(
  frontendContextId: string,
  query: string,
  queryStatus: QueryStatus
) {
  try {
    const hash = generateHash();
    // llm generated based off perplexity's slug
    const slug = query
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 26)
      .replace(/-+$/, "");
    const indexedPath = `/search/${slug}-${hash}`;

    // todo: get rid of these keys after we index the thread
    await kv.hmset(`frontend-context-id:${frontendContextId}`, {
      query: query,
      status: queryStatus,
      indexedPath: indexedPath,
    });
    await createThread(indexedPath, query);
    return { indexedPath };
  } catch (e) {
    throw new Error(ERROR_MESSAGES.SAVE_CONTEXT);
  }
}

export async function getThreadId(
  frontendContextId: string
): Promise<{ indexedPath: string | null } | null> {
  if (!frontendContextId) {
    return null;
  }
  try {
    const result = await kv.hgetall(`frontend-context-id:${frontendContextId}`);
    if (!result) {
      return null;
    }
    return { indexedPath: result.indexedPath as string | null };
  } catch (e) {
    throw new Error(ERROR_MESSAGES.RETRIEVE_CONTEXT);
  }
}

export async function createThread(
  indexedPath: string,
  query: string
): Promise<void> {
  try {
    const currentTime = new Date().toISOString();
    await kv.hmset(`thread-id:${indexedPath}`, {
      query: query,
      createdAt: currentTime,
    });
  } catch (e) {
    throw new Error(ERROR_MESSAGES.CREATE_THREAD);
  }
}

export async function saveThreadSourceResults(
  indexedPath: string,
  sourceResults: any,
  imageResults: any
): Promise<void> {
  try {
    await kv.hmset(`thread-id:${indexedPath}`, {
      sourceResults: JSON.stringify(sourceResults),
      imageResults: JSON.stringify(imageResults),
    });
  } catch (e) {
    throw new Error(ERROR_MESSAGES.SAVE_THREAD);
  }
}

export async function saveConversationToThread(
  indexedPath: string,
  state: any
): Promise<void> {
  try {
    await kv.hmset(`thread-id:${indexedPath}`, {
      conversationState: JSON.stringify(state),
    });
  } catch (e) {
    throw new Error(ERROR_MESSAGES.SAVE_CONVERSATION);
  }
}

export async function getConversation(
  indexedPath: string
): Promise<any | null> {
  if (!indexedPath) {
    return null;
  }

  try {
    const result = await kv.hget(
      `thread-id:${indexedPath}`,
      "conversationState"
    );
    if (!result) {
      return null;
    }
    return result;
  } catch (e) {
    throw new Error(ERROR_MESSAGES.RETRIEVE_CONVERSATION);
  }
}

export async function getQuery(
  frontendContextId: string
): Promise<{ query: string | null; status: QueryStatus } | null> {
  if (!frontendContextId) {
    return null;
  }

  return await retry(
    async () => {
      const result = await kv.hgetall(
        `frontend-context-id:${frontendContextId}`
      );
      if (!result) {
        return null;
      }
      return result as { query: string | null; status: QueryStatus };
    },
    10,
    250
  );
}

export async function getThreadData(indexedPath: string): Promise<any | null> {
  noStore();

  if (!indexedPath) {
    return null;
  }

  const maxRetries = 10;
  const retryDelay = 250;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await kv.hgetall(`thread-id:${indexedPath}`);

      if (
        !result ||
        !result.query ||
        !result.sourceResults ||
        !result.imageResults
      ) {
        if (attempt === maxRetries - 1) {
          return null;
        }
      } else {
        const threadData = {
          query: result.query,
          sourceResults: result.sourceResults,
          imageResults: result.imageResults,
        };
        return threadData;
      }
    } catch (e) {
      if (attempt === maxRetries - 1) {
        throw new Error(ERROR_MESSAGES.RETRIEVE_THREAD_DATA);
      }
    }
    await setTimeout(retryDelay);
  }

  revalidatePath("/search/[slug]/page");

  return null;
}

export async function getRecentThreads(limit: number): Promise<any[]> {
  try {
    const keys = await kv.keys("thread-id:*");

    const sortedKeys = await Promise.all(
      keys.map(async (key) => {
        const threadData = await kv.hgetall(key);
        return {
          key,
          createdAt: threadData?.createdAt
            ? new Date(threadData.createdAt as string)
            : new Date(0),
        };
      })
    );

    sortedKeys.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const recentThreadKeys = sortedKeys.slice(0, limit);

    const recentThreads = await Promise.all(
      recentThreadKeys.map(async (thread) => {
        const threadData = await kv.hgetall(thread.key);
        return {
          ...thread,
          query: threadData?.query || null,
        };
      })
    );

    return recentThreads;
  } catch (e) {
    throw new Error(ERROR_MESSAGES.RETRIEVE_RECENT_THREADS);
  }
}
