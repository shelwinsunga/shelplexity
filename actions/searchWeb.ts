'use server'
import { cache } from 'react'

const BRAVE_API_KEY = process.env.BRAVE_API_KEY

export const searchWeb = cache(async (query: string | null): Promise<any[]> => {

    if (!query) {
        return []
    }
    
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}result_filter=web`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip',
                'X-Subscription-Token': BRAVE_API_KEY || ''
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const results = data.web?.results || [];
        return results;
    } catch (error) {
        console.error('Error fetching data from Brave Search API:', error);
        return [];
    }
})