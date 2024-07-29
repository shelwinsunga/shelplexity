'use client';

import { SearchResultsDisplay } from '@/components/search/SearchResultsDisplay';
import { useFrontend } from '@/contexts/FrontendContext';
import { SearchSourcesDisplay } from '@/components/search/SearchSourcesDisplay';

export default function SearchPage() {
  const { query } = useFrontend();

  return (
    <>
      <div className="mt-8">
        <h1 className="text-3xl font-semibold mb-6">{query}</h1>

        <div className="flex flex-col items-start justify-start h-screen">
          <div className="flex flex-col gap-6">
            <SearchSourcesDisplay query={query} />
            <SearchResultsDisplay />
          </div>
        </div>
      </div>
    </>
  );
}