import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateHash() {
  return Math.random().toString(36).substring(2, 15).replace(/[^a-zA-Z0-9]/g, '');
}

export     function parseWebResults(webResults: any): Array<{ url: string; description: string; index: number }> {
  if (!Array.isArray(webResults)) {
      return [];
  }

  const results = typeof webResults === 'string' ? JSON.parse(webResults) : webResults;

  return results.map((result: any, index: number) => ({
      url: result.url,
      description: result.description,
      index: index + 1
  }));
}