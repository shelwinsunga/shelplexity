export async function searchAPI(query: string): Promise<string[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    const text = 'Lorem';
    
    const fakeResults = [
      `${text} - Latest news and updates`,
      `Top 10 ${text} trends in 2024`,
      `How to learn about ${text} quickly`,
      `${text} for beginners: A comprehensive guide`,
      `Expert opinions on ${text}`,
      `${text} vs alternatives: A comparison`,
      `The history and evolution of ${text}`,
      `${text} in practice: Real-world applications`,
    ];
    
    const numberOfResults = Math.floor(Math.random() * 5) + 3; // Return 3 to 7 results
    return fakeResults.sort(() => 0.5 - Math.random()).slice(0, numberOfResults);
}