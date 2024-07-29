
import { searchWeb } from '@/actions/searchWeb';
import { Skeleton } from "@/components/ui/skeleton"
import SourceGallery from '@/components/search/SourceGallery';
import { getQuery } from '@/actions/saveQuery';

export default async function Sources({   searchParams,
}: { searchParams: any}) {
    const frontendContextId = searchParams.newFrontendContextUUID;
    const queryData = await getQuery(frontendContextId);
    const results: any = await searchWeb(queryData?.query || null);

    return (
        <div className="space-y-2">
            <SourceGallery SourceResults={results} />
        </div>
    );
}