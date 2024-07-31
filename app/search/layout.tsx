export default function SearchLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <div className="container mx-auto px-4 py-16 w-[50%]">
            <div className="flex flex-col items-start justify-start h-screen">
                {children}
            </div>
        </div>
    );
}
