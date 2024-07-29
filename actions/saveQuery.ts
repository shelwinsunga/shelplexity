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