
export default function SearchLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <div className="container mx-auto px-4 py-16 w-[40%]">
            {children}
        </div>
    );
}
