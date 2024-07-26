'use client'
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function Search() {
    const [searchData, setSearchData] = useState({
        query: '',
    });
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
        setSearchData({ query: term });
    }

    return (
        <>
            <div className="flex gap-2">
                <Input
                    placeholder="search..."
                    onChange={(e) => setSearchData({ query: e.currentTarget.value })}
                    onKeyDown={(e) => { if (e.key === 'Enter') { handleSearch(e.currentTarget.value) } }}
                    defaultValue={searchParams.get('query')?.toString()} // for populating the URL when its shared
                />
            <Button onClick={() => handleSearch(searchData.query)}>Search</Button>
        </div>
        </>
    );
}
