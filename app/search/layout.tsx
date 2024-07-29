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
        <div className="container mx-auto px-4 py-16 w-[40%]">
            {children}
        </div>
    );
}
