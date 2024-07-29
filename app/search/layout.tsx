import SearchHeader from '@/components/search/SearchHeader';
import { Suspense } from 'react';

export default function SearchLayout({
    sources,
    children,
}: {
    sources: React.ReactNode
    children: React.ReactNode
}) {

    return (
        <div className="container mx-auto px-4 py-16 w-[40%]">
            <Suspense fallback={<div>Loading header...</div>}>
                <SearchHeader />
            </Suspense>
            <div className="mt-8">
                <div className="flex flex-col items-start justify-start h-screen">
                        {sources}
                        {children}
                </div>
            </div>
        </div>
    );
}
