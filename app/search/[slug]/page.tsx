import { SearchInput } from '@/components/search/SearchInput';
import { SearchResults } from '@/components/search/SearchResults';

export default function SearchResultPage({ params }: { params: { slug: string } }) {
  const query = decodeURIComponent(params.slug.split('-')[0]);

  return (
    <div>
      <h1>Search Results</h1>
      <SearchResults query={query} />
    </div>
  );
}