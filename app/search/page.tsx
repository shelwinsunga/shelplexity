import { SearchResultsDisplay } from '@/components/search/SearchResultsDisplay';
export default function SearchPage() {

  return (
    <>
        {/* <SearchSourcesDisplay query={query} /> */}
        <div className="w-full h-full mt-6">
            <SearchResultsDisplay />
        </div>
    </>
  );
}