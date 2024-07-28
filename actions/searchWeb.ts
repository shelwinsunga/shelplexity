import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export async function searchWeb(query: string): Promise<string[]> {
    const BRAVE_API_KEY = process.env.BRAVE_API_KEY;
    
    if (!BRAVE_API_KEY) {
        throw new Error('BRAVE_API_KEY is not set in .env.local');
    }

    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip',
                'X-Subscription-Token': BRAVE_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Assuming the API returns an array of results with titles
        // Adjust this based on the actual structure of the API response
        return data.web.results.map((result: any) => result.title);
    } catch (error) {
        console.error('Error fetching search results:', error);
        return [];
    }
    
    return [];
}