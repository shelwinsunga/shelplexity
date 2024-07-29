
import { searchWeb } from '@/actions/searchWeb';
import SourceGallery from '@/components/search/SourceGallery';
import { getQuery } from '@/actions/saveQuery';
import { getThreadId } from '@/actions/saveQuery';
import { saveThread } from '@/actions/saveQuery';

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