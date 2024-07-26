'use client'
import { Input } from "@/components/ui/input";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Search() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <>
            <Input
                placeholder="search..."
                onKeyDown={(e) => { if (e.key === 'Enter') { handleSearch(e.currentTarget.value) } }}
                defaultValue={searchParams.get('query')?.toString()} // for populating the URL when its shared
            />
        </>
    );
}
