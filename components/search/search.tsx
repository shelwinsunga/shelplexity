'use client'
import { Input } from "@/components/ui/input";

export default function Search() {

    function handleSearch(term: string) {
        console.log(term);
    }


    return (
        <>
            <Input
                placeholder="search..."
                onChange={(e) => { handleSearch(e.target.value) }}
            />
        </>
    );
}
