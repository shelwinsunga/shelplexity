'use server'

import fs from 'fs/promises'
import path from 'path'
import { cache } from 'react'

export const searchWeb = cache(async (query: string): Promise<any[]> => {
    const dataPath = path.join(process.cwd(), 'data', 'data.json')
    try {
        const rawData = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(rawData)
        return data.web.results
    } catch (error) {
        console.error('Error reading or parsing data:', error)
        return []
    }
})

// Commented out code for Brave API integration
// const BRAVE_API_KEY = 'BSAvvxzei7ZdGlkfxbAbsyVi0MCNrpK';
// ... [rest of the commented out code] ...

// curl -s --compressed "https://api.search.brave.com/res/v1/web/search?q=brave+search" -H "Accept: application/json" -H "Accept-Encoding: gzip" -H "X-Subscription-Token: BSAvvxzei7ZdGlkfxbAbsyVi0MCNrpK"