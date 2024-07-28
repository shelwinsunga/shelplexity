import { searchAPI } from '@/actions/api';

export async function SearchResults({ query }: { query: string }) {
  console.log(query);
  const results = await searchAPI(query);

  return (
    <div>
      <h2>Results for {query}</h2>
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
}