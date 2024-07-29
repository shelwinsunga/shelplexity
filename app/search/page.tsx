'use client';

import { SearchResultsDisplay } from '@/components/search/SearchResultsDisplay';
import { useFrontend } from '@/contexts/FrontendContext';
import { SearchSourcesDisplay } from '@/components/search/SearchSourcesDisplay';

export default function SearchPage() {
  const { query } = useFrontend();

  return (
    <>
        {/* <SearchSourcesDisplay query={query} /> */}
        {/* <SearchResultsDisplay /> */}
    </>
  );
}