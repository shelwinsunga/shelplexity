'use server'

import fs from 'fs/promises'
import path from 'path'
import { cache } from 'react'

const BRAVE_API_KEY = process.env.BRAVE_API_KEY

export const searchWeb = cache(async (query: string | null, count: number = 5): Promise<any[]> => {
    console.log(`[searchWeb] Starting search with query: "${query}", count: ${count}`);
    
    if (!query) {
        console.warn('[searchWeb] No query provided, returning empty array');
        return []
    }
    
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${count}`;
    console.log(`[searchWeb] Constructed URL: ${url}`);
    
    const fetchWithRetry = async (retryCount = 0): Promise<any[]> => {
        console.log(`[fetchWithRetry] [WEB] Attempt ${retryCount + 1}`);
        try {
            console.log('[fetchWithRetry] [WEB] Sending request to Brave Search API');
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'X-Subscription-Token': BRAVE_API_KEY || ''
                }
            });

            console.log(`[fetchWithRetry] [WEB] Received response with status: ${response.status}`);

            if (!response.ok) {
                if (response.status === 429 && retryCount < 3) {
                    const delay = 300 * (retryCount + 1);
                    console.warn(`[fetchWithRetry] [WEB] Rate limit hit. Retrying in ${delay}ms`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return fetchWithRetry(retryCount + 1);
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`[fetchWithRetry] [WEB] Successfully parsed JSON response`);
            
            const results = data.web?.results || [];
            console.log(`[fetchWithRetry] [WEB] Retrieved ${results.length} results`);
            
            return results;
        } catch (error) {
            console.error('[fetchWithRetry] [WEB] Error fetching data from Brave Search API:', error);
            return [];
        }
    };

    const results = await fetchWithRetry();
    console.log(`[searchWeb] Search completed. Returning ${results.length} results`);
    return results;
})

// curl -s --compressed "https://api.search.brave.com/res/v1/web/search?q=brave+search" -H "Accept: application/json" -H "Accept-Encoding: gzip" -H "X-Subscription-Token: ${BRAVE_API_KEY}"