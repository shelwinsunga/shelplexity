
import { searchWeb } from '@/actions/searchWeb';
import SourceGallery from '@/components/search/SourceGallery';
import { getQuery } from '@/actions/threadActions';
import { getThreadId } from '@/actions/threadActions';
import { saveThread } from '@/actions/threadActions';

export default async function Sources({ searchParams }: { searchParams: any }) {
    const frontendContextId = searchParams.newFrontendContextUUID;
    const queryData = await getQuery(frontendContextId);
    const results: any = await searchWeb(queryData?.query || null);
    const threadIdResult = await getThreadId(frontendContextId);
    const indexedPath = threadIdResult?.indexedPath || null;
    
    if (indexedPath) {
        await saveThread(indexedPath, results);
    }


    
    return (
        <SourceGallery SourceResults={results} />
    );
}