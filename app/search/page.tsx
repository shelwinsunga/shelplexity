'use client';

import { SearchResultsDisplay } from '@/components/search/SearchResultsDisplay';
import { useFrontend } from '@/contexts/FrontendContext';
import { SearchSourcesDisplay } from '@/components/search/SearchSourcesDisplay';

export default function Page() {
  const { query } = useFrontend();

  return (
    <div className="flex flex-col items-start justify-start h-screen">
      <div className="flex flex-col gap-6">
        <SearchSourcesDisplay query={query} />
        <SearchResultsDisplay />
      </div>
    </div>
  );
}