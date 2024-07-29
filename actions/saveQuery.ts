'use server'
import { kv } from "@vercel/kv";
import { generateHash } from "@/lib/utils";
type QueryStatus = 'pending' | 'complete' | 'error';

export async function saveFrontendContext(frontendContextId: string, query: string, queryStatus: QueryStatus) {
  try {
    const hash = generateHash();
    const slug = query.toLowerCase().replace(/\s+/g, '-').slice(0, 26);
    const indexedPath = `/search/${slug}-${hash}`;
    await kv.hmset(`frontend-context-id:${frontendContextId}`, {
      query: query,
      status: queryStatus,
      hash: hash,
      indexedPath: indexedPath
    });
    await createThread(hash);
    return { indexedPath };
  } catch (e) {
    console.error('Failed to save frontend context:', e);
    throw new Error('Failed to save frontend context');
  }
}

export async function createThread(hash: string): Promise<void> {
  try {
    // The hmset command requires at least one field-value pair
    await kv.hmset(`thread-id:${hash}`, { created: Date.now() });
  } catch (e) {
    console.error('Failed to create thread:', e);
    throw new Error('Failed to create thread');
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
