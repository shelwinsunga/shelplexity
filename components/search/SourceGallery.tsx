'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import Link from 'next/link';
import Image from 'next/image';
import { Skeleton } from "@/components/ui/skeleton";

export default function SourceGallery({ SourceResults }: { SourceResults: any[] }) {
    if (!SourceResults || !Array.isArray(SourceResults)) {
        return null; // or return a placeholder component
    }

    const visibleResults = SourceResults.slice(0, 3);
    const restResults = SourceResults.slice(3);

    return (
        <div className="flex flex-row gap-2 w-full">
            {visibleResults.map((result: any, index: number) => (
                <Link key={index} href={result.url} className="w-[calc(25%-0.5rem)] h-full">
                    <Card className="h-full">
                        <CardHeader className="py-3 px-3">
                            <CardTitle className="text-xs truncate">{result.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-3 pt-1 px-3">
                            <div className="flex items-center">
                                <img src={result.profile.img} alt={result.title} width={16} height={16} className="rounded-full mr-2" />
                                <div className="flex items-center gap-1">
                                    <span className="text-muted-foreground/80 hover:underline text-xs truncate">{result.profile.name}</span>
                                    <span className="text-muted-foreground/80 text-xs">•</span>
                                    <span className="text-muted-foreground/80 text-xs">{index + 1}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
            {restResults.length > 0 && (
                <Sheet>
                    <SheetTrigger asChild>
                        <Card className="flex-shrink-0 w-1/4 h-full cursor-pointer">
                            <CardHeader className="py-3 px-3">
                                <CardTitle className="text-xs truncate">Additional Sources</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-3 pt-1 px-3">
                                <div className="flex items-center">
                                    <div className="flex items-center gap-1">
                                        <span className="text-muted-foreground/80 text-xs">+{restResults.length} more</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-[300px] overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle>Additional Sources</SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col gap-4 mt-4 max-h-[calc(100vh-120px)]">
                            {restResults.map((result: any, index: number) => (
                                <Link key={index} href={result.url} className="w-full">
                                    <Card className="h-full">
                                        <CardHeader className="py-3 px-3">
                                            <CardTitle className="text-xs truncate">{result.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pb-3 pt-1 px-3">
                                            <div className="flex items-center">
                                                <img src={result.profile.img} alt={result.title} width={16} height={16} className="rounded-full mr-2" />
                                                <div className="flex items-center gap-1">
                                                    <span className="text-muted-foreground/80 hover:underline text-xs truncate">{result.profile.name}</span>
                                                    <span className="text-muted-foreground/80 text-xs">•</span>
                                                    <span className="text-muted-foreground/80 text-xs">{index + 4}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </div>
    );
}

export function SourceGalleryLoading() {
    return (
        <div className="flex flex-row gap-2 w-full">
            {[...Array(3)].map((_, index) => (
                <div key={index} className="w-1/4 h-full">
                    <Card className="h-full">
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
                </div>
            ))}
            <Card className="flex-shrink-0 w-1/4 h-full">
                <CardContent className="flex items-center justify-center h-full">
                    <Skeleton className="h-6 w-20" />
                </CardContent>
            </Card>
        </div>
    );
}
