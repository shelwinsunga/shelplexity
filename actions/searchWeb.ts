"use server";
import { cache } from "react";

const BRAVE_API_KEY = process.env.BRAVE_API_KEY;

// todo, use the retry utility we made
export const searchWeb = cache(
  async (query: string | null, count: number = 5): Promise<any[]> => {
    if (!query) {
      return [];
    }

    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${count}`;

    const retry = async (retryCount = 0): Promise<any[]> => {
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
            return retry(retryCount + 1);
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const results = data.web?.results || [];

        return results;
      } catch (error) {
        return [];
      }
    };

    const results = await retry();
    return results;
  }
);
