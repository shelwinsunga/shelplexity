'use client';
import { SearchArea } from '@/components/search/SearchArea';
import { useFrontend } from '@/contexts/FrontendContext';

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { query } = useFrontend();


    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold mb-6">{query}</h1>
            <div className="mt-8">
                {children}
            </div>
        </div>
    );
}
