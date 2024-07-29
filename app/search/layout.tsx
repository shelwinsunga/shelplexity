import SearchHeader from '@/components/search/SearchHeader';

export default function SearchLayout({
    sources,
    children,
}: {
    sources: React.ReactNode
    children: React.ReactNode
}) {

    return (
        <div className="container mx-auto px-4 py-16 w-[40%]">
            <SearchHeader />
            <div className="mt-8">
            <div className="flex flex-col items-start justify-start h-screen">
            <div className="flex flex-col gap-6">
                {sources}
                {children}
                </div>
            </div>
            </div>
        </div>
    );
}
