import { Suspense } from 'react';
import { SearchResultsDisplay } from '@/components/search/SearchResultsDisplay';

export default function SearchPage() {
  return (
    <>
        {/* <SearchSourcesDisplay query={query} /> */}
        <div className="w-full h-full mt-6">
            <Suspense fallback={<div>Loading...</div>}>
                <SearchResultsDisplay />
            </Suspense>
        </div>
    </>
  );
}