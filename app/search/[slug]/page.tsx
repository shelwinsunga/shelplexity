import { getThreadData } from '@/actions/threadActions';
import SourceGallery from '@/components/search/SourceGallery';
import { Separator } from '@/components/ui/separator'
import { kv } from '@vercel/kv';
import { Suspense } from 'react';

export const dynamicParams = true // true | false,
export const revalidate = false
export const dynamic = 'force-dynamic'

export default async function Page(searchParams: { params: any }) {
  const indexedPath = `/search/${searchParams.params.slug}`;
  const threadData = await getThreadData(indexedPath);
  const query = threadData?.query;
  const sourceResults = threadData?.sourceResults;
  const isLongQuery = query && query.length > 50; // Adjust this threshold as needed


  return (
    <>
      <div className="w-full">
        {isLongQuery ? (
                <>
                    <p className="text-xl font-medium mb-6 pb-2 ">{query}</p>
                    <Separator />
                </>
            ) : (
                <h1 className="text-3xl font-semibold mb-6">{query}</h1>
            )}
        <h2 className="text-2xl font-semibold mb-4">Sources</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <SourceGallery SourceResults={sourceResults} />
        </Suspense>
      </div>
  </>
  );
}