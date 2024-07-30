import { Suspense } from 'react';
import { SearchResultsDisplay } from '@/components/search/SearchResultsDisplay';

export const dynamicParams = true // true | false,
export const revalidate = false
export const dynamic = 'force-dynamic'

export default function SearchPage() {
  return (
    <>
      {/* <SearchSourcesDisplay query={query} /> */}
      <div className="w-full h-full ">
        <Suspense fallback={<div>Loading...</div>}>
          <SearchResultsDisplay />
        </Suspense>
      </div>
    </>
  );
}