'use client'

import { Card, CardContent } from "@/components/ui/card";
import { CircleCheck } from "lucide-react";

export interface SearchQuery {
    query: string;
    status: 'searching' | 'complete';
}

export function PulseDot({ status }: { status: 'searching' | 'complete' }) {
    return (
        <span className="relative flex h-5 w-5 mr-3">
            {status === 'searching' ? (
                <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
                </>
            ) : (
                <CircleCheck className="h-5 w-5 fill-current stroke-background text-green-500" />
            )}
        </span>
    );
}
