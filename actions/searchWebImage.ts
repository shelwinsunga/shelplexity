"use server";

import fs from "fs/promises";
import path from "path";
import { cache } from "react";

const BRAVE_API_KEY = process.env.BRAVE_API_KEY;

export const searchWebImage = cache(
  async (query: string | null, count: number = 20): Promise<any[]> => {
    console.log(
      `[searchWebImage] Starting image search with query: "${query}", count: ${count}`
    );

    if (!query) {
      console.warn("[searchWebImage] No query provided, returning empty array");
      return [];
    }

    // Sanitize the query
    const sanitizedQuery = query.replace(/[^\w\s]/gi, "").trim();
    if (!sanitizedQuery) {
      console.warn(
        "[searchWebImage] Query sanitized to empty string, returning empty array"
      );
      return [];
    }

    const url = `https://api.search.brave.com/res/v1/images/search?q=${encodeURIComponent(query)}&safesearch=strict&count=${count}&search_lang=en&country=us&spellcheck=1`;
    console.log(`[searchWebImage] Constructed URL: ${url}`);

    const fetchWithRetry = async (retryCount = 0): Promise<any[]> => {
      console.log(`[fetchWithRetry] [IMAGE] Attempt ${retryCount + 1}`);
      try {
        console.log(
          "[fetchWithRetry] [IMAGE] Sending request to Brave Search API"
        );
        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
            "Accept-Encoding": "gzip",
            "X-Subscription-Token": BRAVE_API_KEY || "",
          },
        });

        console.log(
          `[fetchWithRetry] [IMAGE] Received response with status: ${response.status}`
        );

        if (!response.ok) {
          if (response.status === 429 && retryCount < 3) {
            const delay = 300 * (retryCount + 1);
            console.warn(
              `[fetchWithRetry] [IMAGE] Rate limit hit. Retrying in ${delay}ms`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
            return fetchWithRetry(retryCount + 1);
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(
          `[fetchWithRetry] [IMAGE] Successfully parsed JSON response`
        );

        const images = data.results || [];
        console.log(
          `[fetchWithRetry] [IMAGE] Retrieved ${images.length} image results`
        );

        return images;
      } catch (error) {
        console.error(
          "[fetchWithRetry] [IMAGE] Error fetching data from Brave Search API:",
          error
        );
        return [];
      }
    };

    const result = await fetchWithRetry();
    console.log(
      `[searchWebImage] Image search completed. Returning ${result.length} results`
    );
    return result;
  }
);

// curl -s --compressed "https://api.search.brave.com/res/v1/images/search?q=munich&safesearch=strict&count=20&search_lang=en&country=us&spellcheck=1" -H "Accept: application/json" -H "Accept-Encoding: gzip" -H "X-Subscription-Token: ${BRAVE_API_KEY}"
