import { SearchArea } from '@/components/search/SearchArea';
import { Snail } from 'lucide-react';
import { SearchLoading, SearchQuery } from '@/components/gen-ui/search-loading/search-loading';

export default function Page() {
  const searchQueries: SearchQuery[] = [
    { query: 'Search 1', status: 'complete' },
    { query: 'Search 2', status: 'complete' },
    { query: 'Search 3', status: 'searching' },
    { query: 'Search 4', status: 'searching' },
    { query: 'Search 5', status: 'searching' },
    { query: 'Search 6', status: 'searching' },
    { query: 'Search 7', status: 'searching' },
    { query: 'Search 8', status: 'searching' },
    { query: 'Search 9', status: 'searching' },
    { query: 'Search 10', status: 'searching' },
    { query: 'Search 11', status: 'searching' },
    { query: 'Search 12', status: 'searching' },
  ];

  return (
    <>
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col sm:flex-row items-center mb-8 text-center sm:text-left">
          <Snail className="w-12 h-12 mb-4 sm:mb-0 sm:mr-4" />
          <h1 className="text-2xl sm:text-3xl font-semibold">Shelplexity</h1>
        </div>
        <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">
          <SearchArea />
        </div>
        <div className="mt-8 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">
          <SearchLoading queries={searchQueries} />
        </div>
      </div>
    </>
  );
}
