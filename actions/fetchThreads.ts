'use server'

import { getRecentThreads } from '@/actions/threadActions';

export async function fetchRecentThreads() {
  return await getRecentThreads(5);
}