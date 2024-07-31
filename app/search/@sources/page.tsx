import { searchWeb } from '@/actions/searchWeb';
import SourceGallery from '@/components/search/SourceGallery';
import { getQuery, getThreadId, getThreadData, saveThreadSourceResults } from '@/actions/threadActions';

export default async function Sources({ searchParams }: { searchParams: any }) {
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
            await saveThreadSourceResults(indexedPath, results);
        }
    } else {
        results = await searchWeb(queryData?.query || null);
    }

    return (
        <div className="w-full">
            <h2 className="text-2xl font-semibold mb-4">Sources</h2>
            <SourceGallery SourceResults={results} />
        </div>
    );
}