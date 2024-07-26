'use client'
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function Search() {
    const [searchData, setSearchData] = useState({
        query: '',
    });
    const router = useRouter();

    function handleSearch(term: string) {
        if (term) {
            router.push(`/search/${encodeURIComponent(term)}`);
        }
        setSearchData({ query: term });
    }

    return (
        <>
            <div className="flex gap-2">
                <Input
                    placeholder="search..."
                    onChange={(e) => setSearchData({ query: e.currentTarget.value })}
                    onKeyDown={(e) => { if (e.key === 'Enter') { handleSearch(e.currentTarget.value) } }}
                />
                <Button onClick={() => handleSearch(searchData.query)}>Search</Button>
            </div>
        </>
    );
}
