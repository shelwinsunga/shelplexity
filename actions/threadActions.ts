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
    await kv.hmset(`thread-id:${indexedPath}`, { query: query });
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
  try {
    const result = await kv.hgetall(`frontend-context-id:${frontendContextId}`);
    if (!result) {
      return null;
    }
    return result as { query: string | null; status: QueryStatus };
  } catch (e) {
    console.error(`Failed to retrieve frontend context: ID - ${frontendContextId}`);
    throw new Error('Failed to retrieve frontend context');
  }
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
    return result.sourceResults ? result.sourceResults : null;
  } catch (e) {
    console.error(`Failed to retrieve thread data: Path - ${indexedPath}`, e);
    throw new Error('Failed to retrieve thread data');
  }
}