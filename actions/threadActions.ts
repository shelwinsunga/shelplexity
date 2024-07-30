'use server'
import { kv } from "@vercel/kv";
import { generateHash } from "@/lib/utils";
type QueryStatus = 'pending' | 'complete' | 'error';

export async function saveFrontendContext(frontendContextId: string, query: string, queryStatus: QueryStatus) {
  try {
    const hash = generateHash();
    const slug = query.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 26).replace(/-+$/, '');
    const indexedPath = `/search/${slug}-${hash}`;
    await kv.hmset(`frontend-context-id:${frontendContextId}`, {
      query: query,
      status: queryStatus,
      indexedPath: indexedPath
    });
    await createThread(indexedPath, query);
    return { indexedPath };
  } catch (e) {
    console.error('Failed to save frontend context:', e);
    throw new Error('Failed to save frontend context');
  }
}

export async function getThreadId(frontendContextId: string): Promise<{ indexedPath: string | null } | null> {
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
    console.error(`Failed to retrieve frontend context: ID - ${frontendContextId}`);
    throw new Error('Failed to retrieve frontend context');
  }
}

export async function createThread(indexedPath: string, query: string): Promise<void> {
  try {
    const currentTime = new Date().toISOString();
    await kv.hmset(`thread-id:${indexedPath}`, { 
      query: query,
      createdAt: currentTime
    });
  } catch (e) {
    console.error('Failed to create thread:', e);
    throw new Error('Failed to create thread');
  }
}

export async function saveThread(indexedPath: string, sourceResults: any): Promise<void> {
  try {
    await kv.hmset(`thread-id:${indexedPath}`, { sourceResults: JSON.stringify(sourceResults) });
  } catch (e) {
    console.error('Failed to save thread:', e); 
    throw new Error('Failed to save thread');
  }
}

export async function getQuery(frontendContextId: string): Promise<{ query: string | null; status: QueryStatus } | null> {
  if (!frontendContextId) {
    console.log('No frontendContextId provided');
    return null;
  }

  const maxRetries = 3;
  const retryDelay = 1000; // 1 second

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt + 1} to retrieve frontend context: ID - ${frontendContextId}`);
      const result = await kv.hgetall(`frontend-context-id:${frontendContextId}`);
      if (!result) {
        console.log(`No result found for frontend context: ID - ${frontendContextId}`);
        if (attempt === maxRetries - 1) {
          return null;
        }
      } else {
        console.log(`Successfully retrieved frontend context: ID - ${frontendContextId}`, result);
        return result as { query: string | null; status: QueryStatus };
      }
    } catch (e) {
      if (attempt === maxRetries - 1) {
        console.error(`Failed to retrieve frontend context after ${maxRetries} attempts: ID - ${frontendContextId}`, e);
        throw new Error('Failed to retrieve frontend context');
      }
      console.warn(`Attempt ${attempt + 1} failed, retrying in ${retryDelay}ms...`);
    }
    await new Promise(resolve => setTimeout(resolve, retryDelay));
  }
  return null;

  // This line should never be reached due to the throw in the last iteration,
  // but TypeScript requires a return statement here
  console.log('Unexpected execution path reached');
  return null;
}

export async function getThreadData(indexedPath: string): Promise<any | null> {
  if (!indexedPath) {
    return null;
  }
  try {
    const result = await kv.hgetall(`thread-id:${indexedPath}`);
    if (!result) {
      return null;
    }
    return {
      query: result.query || null,
      sourceResults: result.sourceResults ?result.sourceResults : null
    };
  } catch (e) {
    console.error(`Failed to retrieve thread data: Path - ${indexedPath}`, e);
    throw new Error('Failed to retrieve thread data');
  }
}

export async function getRecentThreads(limit: number): Promise<any[]> {
  try {
    const keys = await kv.keys('thread-id:*');
    
    const sortedKeys = await Promise.all(keys.map(async (key) => {
      const threadData = await kv.hgetall(key);
      return {
        key,
        createdAt: threadData?.createdAt ? new Date(threadData.createdAt as string) : new Date(0)
      };
    }));

    sortedKeys.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const recentThreadKeys = sortedKeys.slice(0, limit);

    const recentThreads = await Promise.all(recentThreadKeys.map(async (thread) => {
      const threadData = await kv.hgetall(thread.key);
      return {
        ...thread,
        query: threadData?.query || null
      };
    }));

    return recentThreads;

  } catch (e) {
    console.error('Failed to retrieve recent threads:', e);
    throw new Error('Failed to retrieve recent threads');
  }
}


