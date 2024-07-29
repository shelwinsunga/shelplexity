import { Suspense } from 'react';
import { searchWeb } from '@/actions/searchWeb';
import { Skeleton } from "@/components/ui/skeleton"
import SourceGallery from './SourceGallery';

async function SourceResults({ query }: { query: string }) {
    const results: any = await searchWeb(query);

    return (
        <div className="space-y-2">
            <SourceGallery SourceResults={results} />
        </div>
    );
}

function SearchResultsSkeleton() {
    return (
        <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
            ))}
        </div>
    );
}

export function SearchSourcesDisplay({ query }: { query: string }) {
    return (
        <div>
            <h2 className="text-lg font-semibold mb-6">Sources</h2>
            <Suspense fallback={<SearchResultsSkeleton />}>
                <SourceResults query={query} />
            </Suspense>
        </div >
    );
}