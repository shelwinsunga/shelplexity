import { Suspense } from "react";
import { SearchResultsDisplay } from "@/components/search/SearchResultsDisplay";
import SourceGallery from "@/components/search/SourceGallery";
import { getQuery, getThreadId, getThreadData } from "@/actions/threadActions";
import SearchHeader from "@/components/search/SearchHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ImageGallery from "@/components/search/ImageGallery";
import { searchWebImage } from "@/actions/searchWebImage";
import { SourceGalleryLoading } from "@/components/search/SourceGalleryLoading";

export const dynamicParams = true;
export const revalidate = false;
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: any;
}) {
  console.log(
    `[SearchPage] Starting with frontendContextId: ${searchParams.newFrontendContextUUID}`
  );
  const frontendContextId = searchParams.newFrontendContextUUID;

  console.log(
    `[SearchPage] Fetching query data for frontendContextId: ${frontendContextId}`
  );
  const queryData = await getQuery(frontendContextId);
  console.log(`[SearchPage] Query data fetched:`, queryData);

  console.log(
    `[SearchPage] Getting thread ID for frontendContextId: ${frontendContextId}`
  );
  const threadIdResult = await getThreadId(frontendContextId);
  const indexedPath = threadIdResult?.indexedPath || null;
  console.log(`[SearchPage] Indexed path:`, indexedPath);

  let threadData = null;
  if (indexedPath) {
    console.log(
      `[SearchPage] Fetching thread data for indexedPath: ${indexedPath}`
    );
    threadData = await getThreadData(indexedPath);
    console.log(`[SearchPage] Thread data fetched:`, threadData);
  } else {
    console.log(
      `[SearchPage] No indexed path available, skipping thread data fetch`
    );
  }

  const results = threadData?.sourceResults || null;
  console.log(
    `[SearchPage] Source results:`,
    results ? `${results.length} items` : "null"
  );

  const images = threadData?.imageResults || null;
  console.log(
    `[SearchPage] Image results:`,
    images ? `${images.length} items` : "null"
  );

  return (
    <>
      <div className="flex h-full w-full">
        <div className="h-full w-full flex gap-8">
          <div className="flex-grow w-2/3">
            <SearchHeader query={queryData?.query || null} />
            <div className="w-full">
              <h2 className="text-2xl font-semibold mb-4">Sources</h2>
              <Suspense fallback={<SourceGalleryLoading />}>
                <SourceGallery SourceResults={results} />
              </Suspense>
            </div>
            <div className="w-full h-full">
              <Suspense fallback={<div>Loading...</div>}>
                <SearchResultsDisplay />
              </Suspense>
            </div>
          </div>
          <div className="w-1/4 h-full">
            <ImageGallery images={images} />
          </div>
        </div>
      </div>
    </>
  );
}
