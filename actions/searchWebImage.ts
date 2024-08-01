"use server";

import fs from "fs/promises";
import path from "path";
import { cache } from "react";

const BRAVE_API_KEY = process.env.BRAVE_API_KEY;

export const searchWebImage = cache(
  async (query: string | null, count: number = 20): Promise<any[]> => {
    if (!query) {
      return [];
    }

    const sanitizedQuery = query.replace(/[^\w\s]/gi, "").trim();
    if (!sanitizedQuery) {
      return [];
    }

    const url = `https://api.search.brave.com/res/v1/images/search?q=${encodeURIComponent(query)}&safesearch=strict&count=${count}&search_lang=en&country=us&spellcheck=1`;

    const fetchWithRetry = async (retryCount = 0): Promise<any[]> => {
      try {
        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
            "Accept-Encoding": "gzip",
            "X-Subscription-Token": BRAVE_API_KEY || "",
          },
        });

        if (!response.ok) {
          if (response.status === 429 && retryCount < 3) {
            const delay = 300 * (retryCount + 1);
            await new Promise((resolve) => setTimeout(resolve, delay));
            return fetchWithRetry(retryCount + 1);
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const images = data.results || [];

        return images;
      } catch (error) {
        return [];
      }
    };

    const result = await fetchWithRetry();
    return result;
  }
);

// curl -s --compressed "https://api.search.brave.com/res/v1/images/search?q=munich&safesearch=strict&count=20&search_lang=en&country=us&spellcheck=1" -H "Accept: application/json" -H "Accept-Encoding: gzip" -H "X-Subscription-Token: ${BRAVE_API_KEY}"
