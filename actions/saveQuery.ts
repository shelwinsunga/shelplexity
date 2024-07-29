'use server'
import { kv } from "@vercel/kv";
type QueryStatus = 'pending' | 'complete' | 'error';

export async function saveFrontendContext(frontendContextId: string, query: string, queryStatus: QueryStatus) {
  try {
    await kv.hmset(`frontend-context-id:${frontendContextId}`, {
      query: query,
      status: queryStatus
    });
    console.log(`Frontend context saved: ID - ${frontendContextId}, Query - ${query}, Status - ${queryStatus}`);
  } catch (e) {
    console.error(`Failed to save frontend context: ID - ${frontendContextId}, Query - ${query}`);
    throw new Error('Failed to save frontend context')
  }
}

export async function getQuery(frontendContextId: string): Promise<{ query: string | null; status: QueryStatus } | null> {
  if (!frontendContextId) {
    return null;
  }
  try {
    const result = await kv.hgetall(`frontend-context-id:${frontendContextId}`);
    if (!result) {
      console.log(`No frontend context found for ID: ${frontendContextId}`);
      return null;
    }
    console.log(`Retrieved frontend context: ID - ${frontendContextId}, Query - ${result.query}, Status - ${result.status}`);
    return result as { query: string | null; status: QueryStatus };
  } catch (e) {
    console.error(`Failed to retrieve frontend context: ID - ${frontendContextId}`);
    throw new Error('Failed to retrieve frontend context');
  }
}
