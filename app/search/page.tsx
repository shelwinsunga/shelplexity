import { Suspense } from 'react';
import { SearchResultsDisplay } from '@/components/search/SearchResultsDisplay';
import SourceGallery from '@/components/search/SourceGallery';
import { getQuery, getThreadId, getThreadData } from '@/actions/threadActions';
import SearchHeader from '@/components/search/SearchHeader';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamicParams = true
export const revalidate = false
export const dynamic = 'force-dynamic'

function SourceGalleryLoading() {
  return (
    <div className="flex flex-row gap-2 w-full">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="w-1/4 h-full">
          <Card className="h-full">
            <CardHeader className="py-3 px-3">
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="pb-3 pt-1 px-3">
              <div className="flex items-center">
                <Skeleton className="h-4 w-4 rounded-full mr-2" />
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-3" />
                  <Skeleton className="h-3 w-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
      <Card className="flex-shrink-0 w-1/4 h-full">
        <CardContent className="flex items-center justify-center h-full">
          <Skeleton className="h-6 w-20" />
        </CardContent>
      </Card>
    </div>
  );
}

export default async function SearchPage({ searchParams }: { searchParams: any }) {

  const frontendContextId = searchParams.newFrontendContextUUID;
  const queryData = await getQuery(frontendContextId);
  const indexedPath = (await getThreadId(frontendContextId))?.indexedPath || null;
  const results = indexedPath ? (await getThreadData(indexedPath))?.sourceResults || null : null;

  return (
    <>
      <SearchHeader query={queryData?.query || null} />
      <div className="w-full">
        <h2 className="text-2xl font-semibold mb-4">Sources</h2>
        <Suspense fallback={<SourceGalleryLoading />}>
          <SourceGallery SourceResults={results} />
        </Suspense>
      </div>
      <div className="w-full h-full ">
        <Suspense fallback={<div>Loading...</div>}>
          <SearchResultsDisplay />
        </Suspense>
      </div>
    </>
  );
}