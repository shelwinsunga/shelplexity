
'use client'
import { useFrontend } from '@/contexts/FrontendContext'

export default function SearchHeader() {
    const { query } = useFrontend();
	return (
        <h1 className="text-3xl font-semibold mb-6">{query}</h1>
	);
};

