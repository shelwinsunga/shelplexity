'use client'
import { Card, CardContent } from "@/components/ui/card";
import { PulseDot } from "./pulse-dot";
import { Snail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import { useFrontend } from "@/contexts/FrontendContext";
export interface SearchQuery {
    query: string;
    status: "searching" | "complete";
}


export function SearchLoading({ queries }: { queries: SearchQuery[] }) {
    const { searchProgress } = useFrontend();

    useEffect(() => {
        console.log(searchProgress);
    }, [searchProgress]);


    return (
        <Card className="w-full">
            <CardContent className="p-4 w-full">
                <div className="flex items-center mb-2 h-[36px] ">
                    <Snail className="w-6 h-6 mr-2" />
                    <div className="text-lg font-semibold">Deep Search</div>
                </div>
                <Separator className="my-4" />
                {queries.map((query, index) => (
                    <div key={index} className="flex items-center mb-2 last:mb-0">
                        <PulseDot status={query.status} />
                        <span className="">{query.query}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
