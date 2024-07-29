'use server'
import { kv } from "@vercel/kv";
type QueryStatus = 'pending' | 'complete' | 'error';

export async function saveThread(threadId: string, sources: string[]) {
  try {
    await kv.hmset(`thread-id:${threadId}`, {
      sources: sources,
    });
  } catch (e) {
    throw new Error('Failed to save thread')
  }
}
