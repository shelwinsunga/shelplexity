import { Suspense } from 'react';
import { SearchInput } from '@/components/search/SearchInput';
import { SearchResults } from '@/components/search/SearchResults';

export default function SearchPage({
  searchParams
}: {
  searchParams: { q: string; status: string }
}) {
  const { q, status } = searchParams;

  return (
    <div>
      <h1>Search</h1>
      <SearchInput />
      {status === 'pending' ? (
        <p>Searching...</p>
      ) : q ? (
        <Suspense fallback={<p>Loading results...</p>}>
          <SearchResults query={q} />
        </Suspense>
      ) : null}
    </div>
  );
}
