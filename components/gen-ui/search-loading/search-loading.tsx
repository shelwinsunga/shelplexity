"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Snail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useFrontend } from "@/contexts/FrontendContext";
import { AnimatePresence, motion } from "framer-motion";
import { PulseDot } from "./pulse-dot";

export interface SearchQuery {
    query: string;
    status: "searching" | "complete";
}

export function SearchLoading() {
    const { searchProgress } = useFrontend();
    const [isVisible, setIsVisible] = useState(true);
    const [expandedQueries, setExpandedQueries] = useState<string[]>([]);

    useEffect(() => {
        if (Array.isArray(searchProgress) && searchProgress.length > 0) {
            const allComplete = searchProgress.every(
                (query) => query.status === "complete"
            );
            if (allComplete) {
                setIsVisible(false);
            }

            // Expand queries as they complete
            const newExpandedQueries = searchProgress
                .filter((query) => query.status === "complete")
                .map((query) => query.query);
            setExpandedQueries(newExpandedQueries);
        }
    }, [searchProgress]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <Card className="w-full mt-4">
                        <CardContent className="p-4 w-full">
                            <div className="flex items-center mb-2 h-[36px] ">
                                <Snail className="w-6 h-6 mr-2" />
                                <div className="text-lg font-semibold">Deep Search</div>
                            </div>
                            <Separator className="my-4" />
                            {searchProgress.length === 0 ? (
                                <div className="flex items-center mb-2">
                                    <PulseDot status="searching" />
                                    <span>Searching</span>
                                </div>
                            ) : (
                                searchProgress.map((query: SearchQuery, index: number) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-center gap-2 mb-0 last:mb-0"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{
                                            height: expandedQueries.includes(query.query) ? "auto" : 0,
                                            opacity: expandedQueries.includes(query.query) ? 1 : 0
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <PulseDot status={query.status} />
                                        <span>{query.query}</span>
                                    </motion.div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
