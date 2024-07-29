
'use server'


import fs from 'fs/promises'
import path from 'path'

export async function searchWeb(query: string): Promise<string[]> {
    const dataPath = path.join(process.cwd(), 'data', 'data.json')
    const rawData = await fs.readFile(dataPath, 'utf-8')
    const data = JSON.parse(rawData)
    return data



  

    // const BRAVE_API_KEY = 'BSAvvxzei7ZdGlkfxbAbsyVi0MCNrpK';

    // const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`;
    
    // try {
    //     const response = await fetch(url, {
    //         method: 'GET',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Accept-Encoding': 'gzip',
    //             'X-Subscription-Token': BRAVE_API_KEY
    //         }
    //     });

    //     if (!response.ok) {
    //         throw new Error(`HTTP error! status: ${response.status}`);
    //     }

    //     const data = await response.json();
    //     console.log(data);
    //     // Assuming the API returns an array of results with titles
    //     // Adjust this based on the actual structure of the API response
    //     return data;
    // } catch (error) {
    //     console.error('Error fetching search results:', error);
    //     return [];
    // }
}

// curl -s --compressed "https://api.search.brave.com/res/v1/web/search?q=brave+search" -H "Accept: application/json" -H "Accept-Encoding: gzip" -H "X-Subscription-Token: BSAvvxzei7ZdGlkfxbAbsyVi0MCNrpK"