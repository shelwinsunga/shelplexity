'use server'

import fs from 'fs/promises'
import path from 'path'
import { cache } from 'react'
import { performance } from 'perf_hooks'

const BRAVE_API_KEY = process.env.BRAVE_API_KEY

// export const searchWeb = cache(async (query: string | null): Promise<any[]> => {
//     if (!query) {
//         return []
//     }
//     const dataPath = path.join(process.cwd(), 'data', 'data.json')
//     try {
//         const rawData = await fs.readFile(dataPath, 'utf-8')
//         const data = JSON.parse(rawData)
//         return data.web.results
//     } catch (error) {
//         console.error('Error reading or parsing data:', error)
//         return []
//     }
// })

// Commented out code for Brave API integration
export const searchWeb = cache(async (query: string | null): Promise<any[]> => {
    console.log('searchWeb function started')
    const startTime = performance.now()

    if (!query) {
        console.log('searchWeb function ended: No query provided')
        console.log(`Execution time: ${performance.now() - startTime} ms`)
        return []
    }
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&extra_snippets=true`;
    
    const fetchWithRetry = async (retryCount = 0): Promise<any[]> => {
        try {
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'X-Subscription-Token': BRAVE_API_KEY || ''
                }
            });

            if (!response.ok) {
                if (response.status === 429 && retryCount < 3) {
                    // Retry after a short delay if we hit the rate limit
                    await new Promise(resolve => setTimeout(resolve, 300 * (retryCount + 1)));
                    return fetchWithRetry(retryCount + 1);
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.web?.results || [];
        } catch (error) {
            console.error('Error fetching data from Brave Search API:', error);
            return [];
        }
    };

    const results = await fetchWithRetry();
    
    console.log('searchWeb function ended')
    console.log(`Execution time: ${performance.now() - startTime} ms`)
    return results;
})

// curl -s --compressed "https://api.search.brave.com/res/v1/web/search?q=brave+search" -H "Accept: application/json" -H "Accept-Encoding: gzip" -H "X-Subscription-Token: ${BRAVE_API_KEY}"