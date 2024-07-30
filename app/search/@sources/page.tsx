import { searchWeb } from '@/actions/searchWeb';
import SourceGallery from '@/components/search/SourceGallery';
import { getQuery, getThreadId, saveThread, getThreadData } from '@/actions/threadActions';

export default async function Sources({ searchParams }: { searchParams: any }) {
    console.log('Starting Sources function with searchParams:', searchParams);

    const frontendContextId = searchParams.newFrontendContextUUID;
    console.log('frontendContextId:', frontendContextId);

    const queryData = await getQuery(frontendContextId);
    console.log('queryData:', queryData);

    const threadIdResult = await getThreadId(frontendContextId);
    console.log('threadIdResult:', threadIdResult);

    const indexedPath = threadIdResult?.indexedPath || null;
    console.log('indexedPath:', indexedPath);

    let results: any = null;

    if (indexedPath) {
        console.log('Indexed path exists, fetching thread data');
        const threadData = await getThreadData(indexedPath);
        console.log('threadData:', threadData);

        if (threadData && threadData.sourceResults) {
            console.log('Using existing source results from thread data');
            results = threadData.sourceResults;
        } else {
            console.log('No existing source results, performing web search');
            results = await searchWeb(queryData?.query || null);
            console.log('Web search results:', results);
            console.log('Saving thread with new results');
            await saveThread(indexedPath, results);
        }
    } else {
        console.log('No indexed path, performing web search');
        results = await searchWeb(queryData?.query || null);
        console.log('Web search results:', results);
    }

    console.log('Final results:', results);

    return (
        <div className="w-full">
            <h2 className="text-2xl font-semibold mb-4">Sources</h2>
            <SourceGallery SourceResults={results} />
        </div>
    );
}