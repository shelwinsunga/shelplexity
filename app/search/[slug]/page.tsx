'use client'
import { Suspense } from 'react';

// Simulated fetch function
const simulateFetch = async (query: string) => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return {
    results: [
      { id: 1, title: `Result 1 for ${query}` },
      { id: 2, title: `Result 2 for ${query}` },
      { id: 3, title: `Result 3 for ${query}` },
    ]
  };
};

// Search results component
async function SearchResults({ query }: { query: string }) {
  const data = await simulateFetch(query);
  
  return (
    <ul>
      {data.results.map(result => (
        <li key={result.id}>{result.title}</li>
      ))}
    </ul>
  );
}

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h1>Search results for: {params.slug}</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchResults query={params.slug} />
      </Suspense>
    </div>
  );
}