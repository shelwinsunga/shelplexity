export async function searchAPI(query: string): Promise<string[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [`Result 1 for ${query}`, `Result 2 for ${query}`, `Result 3 for ${query}`];
  }