
import { searchWeb } from '@/actions/searchWeb';
import SourceGallery from '@/components/search/SourceGallery';
import { getQuery } from '@/actions/saveQuery';

export default async function Sources({ searchParams,
}: { searchParams: any }) {
    const frontendContextId = searchParams.newFrontendContextUUID;
    const queryData = await getQuery(frontendContextId);
    const results: any = await searchWeb(queryData?.query || null);

    return (
        <SourceGallery SourceResults={results} />
    );
}