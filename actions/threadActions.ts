'use server'
import { kv } from "@vercel/kv";
import { generateHash } from "@/lib/utils";
type QueryStatus = 'pending' | 'complete' | 'error';
import { revalidatePath } from 'next/cache'
import { unstable_noStore as noStore } from 'next/cache';

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
    return null;
  }

  const maxRetries = 3;
  const retryDelay = 1000; // 1 second

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await kv.hgetall(`frontend-context-id:${frontendContextId}`);
      if (!result) {
        if (attempt === maxRetries - 1) {
          return null;
        }
      } else {
        return result as { query: string | null; status: QueryStatus };
      }
    } catch (e) {
      if (attempt === maxRetries - 1) {
        throw new Error('Failed to retrieve frontend context');
      }
    }
    await new Promise(resolve => setTimeout(resolve, retryDelay));
  }
  return null;
}

export async function getThreadData(indexedPath: string): Promise<any | null> {
  noStore()

  if (!indexedPath) {
    return null;
  }

  const maxRetries = 10;
  const retryDelay = 250; // 1 second

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await kv.hgetall(`thread-id:${indexedPath}`);
      console.log('result', result);
      
      if (!result || !result.query || !result.sourceResults) {
        if (attempt === maxRetries - 1) {
          return null;
        }
      } else {
        const threadData = {
          query: result.query,
          sourceResults: result.sourceResults
        };
        return threadData;
      }
    } catch (e) {
      if (attempt === maxRetries - 1) {
        console.error('Failed to retrieve thread data:', e);
        throw new Error('Failed to retrieve thread data');
      }
    }
    await new Promise(resolve => setTimeout(resolve, retryDelay));
  }
  
  revalidatePath('/search/[slug]/page')

  return null;
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

