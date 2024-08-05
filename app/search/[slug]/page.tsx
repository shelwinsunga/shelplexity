import { getThreadData } from "@/actions/threadActions";
import SourceGallery from "@/components/search/SourceGallery";
import { Suspense } from "react";
import { SearchTextRender } from "@/components/search/SearchTextRender";
import { getConversation } from "@/actions/threadActions";
import SearchHeader from "@/components/search/SearchHeader";
import ImageGallery from "@/components/search/ImageGallery";
import { SourceGalleryLoading } from "@/components/search/SourceGalleryLoading";
import { deleteThread, deleteFrontendContext } from "@/actions/threadActions";

export const dynamicParams = true; 
export const revalidate = false;
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function Page(searchParams: { params: any }) {
  const indexedPath = `/search/${searchParams.params.slug}`;
  const threadData = await getThreadData(indexedPath);
  const query = threadData?.query;
  const sourceResults = threadData?.sourceResults;
  const images = threadData?.imageResults;
  const conversation = await getConversation(indexedPath);
  await deleteFrontendContext(indexedPath);

  return (
    <>
      <div className="flex h-full w-full">
        <div className="h-full w-full flex gap-8">
          <div className="flex-grow w-2/3">
            <SearchHeader query={query} />
            <div className="w-full">
              <h2 className="text-2xl font-semibold mb-4">Sources</h2>
              <Suspense fallback={<SourceGalleryLoading />}>
                <SourceGallery SourceResults={sourceResults} />
              </Suspense>
            </div>
            <div className="w-full h-full">
              <Suspense fallback={<div>Loading...</div>}>
                <SearchTextRender disableFade={true}>
                  {conversation}
                </SearchTextRender>
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
