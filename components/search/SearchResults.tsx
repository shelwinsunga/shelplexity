import { searchAPI } from '@/lib/api';

export async function SearchResults({ query }: { query: string }) {
  const results = await searchAPI(query);

  return (
    <div>
      <h2>Results for "{query}"</h2>
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
}