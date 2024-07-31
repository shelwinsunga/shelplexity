'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container mx-auto px-1 py-16 w-[100%]">
            {/* Search Header Skeleton */}
            <div className="mb-8">
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
            </div>

            {/* Source Gallery Skeleton */}
            <div className="flex flex-row gap-2 w-full mb-8">
                {[...Array(3)].map((_, index) => (
                    <Card key={index} className="w-1/4 h-32">
                        <CardHeader className="py-3 px-3">
                            <Skeleton className="h-4 w-3/4" />
                        </CardHeader>
                        <CardContent className="pb-3 pt-1 px-3">
                            <div className="flex items-center">
                                <Skeleton className="h-4 w-4 rounded-full mr-2" />
                                <div className="flex items-center gap-1">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-3 w-3" />
                                    <Skeleton className="h-3 w-3" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                <Card className="flex-shrink-0 w-1/4 h-32">
                    <CardContent className="flex items-center justify-center h-full">
                        <Skeleton className="h-6 w-20" />
                    </CardContent>
                </Card>
            </div>

            {/* Search Results Skeleton */}
            <div className="flex flex-col items-start justify-start space-y-6">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="w-full">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                ))}
            </div>

            {/* Additional Content Skeleton */}
            <div className="mt-8">
                <Skeleton className="h-8 w-1/2 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, index) => (
                        <Card key={index} className="h-40">
                            <CardHeader>
                                <Skeleton className="h-5 w-3/4" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-2/3" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}