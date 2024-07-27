
import { Suspense } from 'react';
import { SearchResults } from '@/components/search/SearchResults';

export default function SearchPage({
  searchParams
}: {
  searchParams: { q?: string }
}) {
  const { q } = searchParams;
  console.log(q);

  return (
    <div>
      <h1>Search</h1>
      {q === 'pending' ? (
        <p>Searching...</p>
      ) : q ? (
        <Suspense fallback={<p>Loading results...</p>}>
          <SearchResults query={q} />
        </Suspense>
      ) : null}
    </div>
  );
}
