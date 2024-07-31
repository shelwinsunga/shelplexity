'use server'

import fs from 'fs/promises'
import path from 'path'
import { cache } from 'react'

const BRAVE_API_KEY = process.env.BRAVE_API_KEY

export const searchWebImage = cache(async (query: string | null, count: number = 20): Promise<any[]> => {
    if (!query) {
        return []
    }
    const url = `https://api.search.brave.com/res/v1/images/search?q=${encodeURIComponent(query)}&safesearch=strict&count=${count}&search_lang=en&country=us&spellcheck=1`;
    console.log('Constructed URL:', url);
    
    const fetchWithRetry = async (retryCount = 0): Promise<any[]> => {
        try {
            console.log('Attempting fetch, retry count:', retryCount);
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'X-Subscription-Token': BRAVE_API_KEY || ''
                }
            });

            console.log('Response status:', response.status);
            if (!response.ok) {
                if (response.status === 429 && retryCount < 3) {
                    console.log('Rate limit hit, retrying after delay');
                    await new Promise(resolve => setTimeout(resolve, 300 * (retryCount + 1)));
                    return fetchWithRetry(retryCount + 1);
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const images = data.results || [];

            return images;
        } catch (error) {
            console.error('Error fetching data from Brave Image Search API:', error);
            return [];
        }
    };

    const result = await fetchWithRetry();
    console.log('Final result:', result);
    return result;
})

// curl -s --compressed "https://api.search.brave.com/res/v1/images/search?q=munich&safesearch=strict&count=20&search_lang=en&country=us&spellcheck=1" -H "Accept: application/json" -H "Accept-Encoding: gzip" -H "X-Subscription-Token: ${BRAVE_API_KEY}"