import { Suspense } from "react";
import { SearchResultsDisplay } from "@/components/search/SearchResultsDisplay";
import SourceGallery from "@/components/search/SourceGallery";
import { getQuery, getThreadId, getThreadData } from "@/actions/threadActions";
import SearchHeader from "@/components/search/SearchHeader";
import ImageGallery from "@/components/search/ImageGallery";
import { SourceGalleryLoading } from "@/components/search/SourceGalleryLoading";
import { SearchLoading } from "@/components/gen-ui/search-loading/search-loading";
import { deleteFrontendContext } from "@/actions/threadActions";

export const dynamicParams = true;
export const revalidate = false;
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: any;
}) {
  const frontendContextId = searchParams.newFrontendContextUUID;

  const queryData = await getQuery(frontendContextId);

  const threadIdResult = await getThreadId(frontendContextId);
  const indexedPath = threadIdResult?.indexedPath || null;

  let threadData = null;
  if (indexedPath) {
    threadData = await getThreadData(indexedPath);
  }
  const results = threadData?.sourceResults || null;
  const images = threadData?.imageResults || null;
  await deleteFrontendContext(indexedPath);


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
                <SearchLoading />
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
