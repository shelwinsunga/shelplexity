
'use server'

import fs from 'fs/promises'
import path from 'path'

export async function searchWeb(query: string): Promise<string[]> {
    const BRAVE_API_KEY = 'BSAvvxzei7ZdGlkfxbAbsyVi0MCNrpK';

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

        // Write raw JSON response to file
        const dataDir = path.join(process.cwd(), 'data');
        const fileName = `${query.replace(/\s+/g, '_').toLowerCase()}.json`;
        const filePath = path.join(dataDir, fileName);

        try {
            await fs.mkdir(dataDir, { recursive: true });
            await fs.writeFile(filePath, JSON.stringify(data, null, 4), 'utf-8');
            console.log(`Raw JSON response written to ${filePath}`);

            // Read the file immediately after writing
            const rawData = await fs.readFile(filePath, 'utf-8');
            const parsedData = JSON.parse(rawData);

            console.log(parsedData.web.results);
            return parsedData.web.results;
        } catch (fileError) {
            console.error('Error writing or reading JSON file:', fileError);
            return [];
        }
    } catch (error) {
        console.error('Error fetching search results:', error);
        return [];
    }
}

// curl -s --compressed "https://api.search.brave.com/res/v1/web/search?q=brave+search" -H "Accept: application/json" -H "Accept-Encoding: gzip" -H "X-Subscription-Token: BSAvvxzei7ZdGlkfxbAbsyVi0MCNrpK"