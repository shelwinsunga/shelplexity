'use server'
import { setTimeout } from "timers/promises";

export async function retry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 10,
    baseDelay: number = 50
  ): Promise<T> {
    let lastError: Error | null = null;
  
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
  
        if (attempt < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, attempt);
          await setTimeout(delay);
        }
      }
    }
  
    throw lastError || new Error("Operation failed after max retries");
  }