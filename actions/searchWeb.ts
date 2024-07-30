'use server'

import fs from 'fs/promises'
import path from 'path'
import { cache } from 'react'
import { JSDOM } from 'jsdom';
import { convert } from 'html-to-text';

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
    if (!query) {
        return []
    }
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&extra_snippets=true`;
    
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

        // Write the search results to a JSON file
        const dataPath = path.join(process.cwd(), 'data', query.replace(/\s+/g, '_') + '.json');
        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8');
        console.log('Search results written to:', dataPath);

        // Parse URLs and get their contents
        const webResults = data.web?.results || [];
        const urlContents = await Promise.all(webResults.slice(0, 10).map(async (result: any) => {
          try {
              const contentResponse = await fetch(result.url);
              const html = await contentResponse.text();
  
              // Parse HTML and extract useful text
              const dom = new JSDOM(html);
              const document = dom.window.document;
  
              // Remove script and style elements
              const scripts = document.getElementsByTagName('script');
              const styles = document.getElementsByTagName('style');
              Array.from(scripts).forEach((script) => (script as Element).remove());
              Array.from(styles).forEach((style) => (style as Element).remove());
  
              // Extract text content
              const bodyText = document.body.textContent || '';
              const cleanText = convert(bodyText, {
                  wordwrap: 130,
                  ignoreImage: true,
                  ignoreHref: true,
              });
  
              // Truncate the cleaned text
              const truncatedText = cleanText.substring(0, 5000);
  
              return { url: result.url, content: truncatedText };
          } catch (error) {
              console.error(`Error fetching content for ${result.url}:`, error);
              return { url: result.url, content: null };
            }
        }));

        // Write URL contents to a new file
        const contentsPath = path.join(process.cwd(), 'data', 'analysis.json');
        await fs.writeFile(contentsPath, JSON.stringify(urlContents, null, 2), 'utf-8');
        return webResults;
    } catch (error) {
        console.error('Error fetching data from Brave Search API:', error);
        return [];
    }
})

// curl -s --compressed "https://api.search.brave.com/res/v1/web/search?q=brave+search" -H "Accept: application/json" -H "Accept-Encoding: gzip" -H "X-Subscription-Token: ${BRAVE_API_KEY}"