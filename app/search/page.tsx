import { Suspense } from 'react';
import { SearchResultsDisplay } from '@/components/search/SearchResultsDisplay';
import { searchWeb } from '@/actions/searchWeb';
import SourceGallery from '@/components/search/SourceGallery';
import { getQuery, getThreadId, saveThread, getThreadData } from '@/actions/threadActions';
import SearchHeader from '@/components/search/SearchHeader';

export const dynamicParams = true
export const revalidate = false
export const dynamic = 'force-dynamic'

export default async function SearchPage({ searchParams }: { searchParams: any }) {

  const frontendContextId = searchParams.newFrontendContextUUID;
  const queryData = await getQuery(frontendContextId);
  const threadIdResult = await getThreadId(frontendContextId);
  const indexedPath = threadIdResult?.indexedPath || null;

  let results: any = null;

  if (indexedPath) {
    const threadData = await getThreadData(indexedPath);
    if (threadData && threadData.sourceResults) {
      results = threadData.sourceResults;
    } else {
      results = await searchWeb(queryData?.query || null);
      await saveThread(indexedPath, results);
    }
  } else {
    results = await searchWeb(queryData?.query || null);
  }

  return (
    <>
      <SearchHeader query={queryData?.query || null} />
      <div className="w-full">
        <h2 className="text-2xl font-semibold mb-4">Sources</h2>
        <SourceGallery SourceResults={results} />
      </div>
      <div className="w-full h-full ">
        <Suspense fallback={<div>Loading...</div>}>
          <SearchResultsDisplay />
        </Suspense>
      </div>
    </>
  );
}