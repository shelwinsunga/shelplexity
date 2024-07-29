
'use client'
import { useFrontend } from '@/contexts/FrontendContext'
import { Separator } from '@/components/ui/separator'

export default function SearchHeader() {
    const { query } = useFrontend();
    const isLongQuery = query && query.length > 50; // Adjust this threshold as needed

    return (
        <>
            {isLongQuery ? (
                <>
                    <p className="text-xl font-medium mb-6 pb-2 ">{query}</p>
                    <Separator />
                </>
            ) : (
                <h1 className="text-3xl font-semibold mb-6">{query}</h1>
            )}
        </>
    );
};
