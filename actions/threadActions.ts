'use server'
import { kv } from "@vercel/kv";
import { generateHash } from "@/lib/utils";
type QueryStatus = 'pending' | 'complete' | 'error';
import { revalidatePath } from 'next/cache'
import { unstable_noStore as noStore } from 'next/cache';
import { performance } from 'perf_hooks';

export async function saveFrontendContext(frontendContextId: string, query: string, queryStatus: QueryStatus) {
  console.log('Starting saveFrontendContext function');
  const startTime = performance.now();

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

  const endTime = performance.now();
  console.log(`Ending saveFrontendContext function. Execution time: ${endTime - startTime} ms`);
}

export async function getThreadId(frontendContextId: string): Promise<{ indexedPath: string | null } | null> {
  console.log('Starting getThreadId function');
  const startTime = performance.now();

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

  const endTime = performance.now();
  console.log(`Ending getThreadId function. Execution time: ${endTime - startTime} ms`);
}

export async function createThread(indexedPath: string, query: string): Promise<void> {
  console.log('Starting createThread function');
  const startTime = performance.now();

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

  const endTime = performance.now();
  console.log(`Ending createThread function. Execution time: ${endTime - startTime} ms`);
}

export async function saveThreadSourceResults(indexedPath: string, sourceResults: any): Promise<void> {
  console.log('\x1b[32m%s\x1b[0m', 'Starting saveThreadSourceResults function');
  const startTime = performance.now();

  try {
    await kv.hmset(`thread-id:${indexedPath}`, { sourceResults: JSON.stringify(sourceResults) });
  } catch (e) {
    console.error('Failed to save thread:', e); 
    throw new Error('Failed to save thread');
  }

  const endTime = performance.now();
  console.log('\x1b[32m%s\x1b[0m', `Ending saveThreadSourceResults function. Execution time: ${endTime - startTime} ms`);
}

export async function saveConversationToThread(indexedPath: string, state: any): Promise<void> {
  console.log('Starting saveConversationToThread function');
  const startTime = performance.now();

  try {
    await kv.hmset(`thread-id:${indexedPath}`, { conversationState: JSON.stringify(state) });
  } catch (e) {
    console.error('Failed to save conversation to thread:', e);
    throw new Error('Failed to save conversation to thread');
  }

  const endTime = performance.now();
  console.log(`Ending saveConversationToThread function. Execution time: ${endTime - startTime} ms`);
}

export async function getConversation(indexedPath: string): Promise<any | null> {
  console.log('Starting getConversation function');
  const startTime = performance.now();

  if (!indexedPath) {
    const endTime = performance.now();
    console.log(`Ending getConversation function. Execution time: ${endTime - startTime} ms`);
    return null;
  }

  try {
    const result = await kv.hget(`thread-id:${indexedPath}`, 'conversationState');
    if (!result) {
      const endTime = performance.now();
      console.log(`Ending getConversation function. Execution time: ${endTime - startTime} ms`);
      return null;
    }
    const endTime = performance.now();
    console.log(`Ending getConversation function. Execution time: ${endTime - startTime} ms`);
    return result;
  } catch (e) {
    console.error('Failed to retrieve conversation:', e);
    throw new Error('Failed to retrieve conversation');
  }

  const endTime = performance.now();
  console.log(`Ending getConversation function. Execution time: ${endTime - startTime} ms`);
}


export async function getQuery(frontendContextId: string): Promise<{ query: string | null; status: QueryStatus } | null> {
  console.log('Starting getQuery function');
  const startTime = performance.now();

  if (!frontendContextId) {
    return null;
  }

  const maxRetries = 10;
  const retryDelay = 250; // 1 second

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

  const endTime = performance.now();
  console.log(`Ending getQuery function. Execution time: ${endTime - startTime} ms`);
}

export async function getThreadData(indexedPath: string): Promise<any | null> {
  console.log('\x1b[33m%s\x1b[0m', 'Starting getThreadData function');
  const startTime = performance.now();

  noStore()

  if (!indexedPath) {
    return null;
  }

  const maxRetries = 10;
  const retryDelay = 250; 

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await kv.hgetall(`thread-id:${indexedPath}`);
      console.log('\x1b[33m%s\x1b[0m', 'Result from kv.hgetall of thread-id:', indexedPath, JSON.stringify(result).substring(0, 100) + '...');
      
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
        console.error('\x1b[33m%s\x1b[0m', 'Failed to retrieve thread data:', e);
        throw new Error('Failed to retrieve thread data');
      }
    }
    await new Promise(resolve => setTimeout(resolve, retryDelay));
  }
  
  revalidatePath('/search/[slug]/page')

  return null;
}

export async function getRecentThreads(limit: number): Promise<any[]> {
  console.log('Starting getRecentThreads function');
  const startTime = performance.now();

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

  const endTime = performance.now();
  console.log(`Ending getRecentThreads function. Execution time: ${endTime - startTime} ms`);
}
