'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import Link from 'next/link';
import Image from 'next/image';

export default function SourceGallery({ SourceResults }: { SourceResults: any }) {
    console.log(SourceResults);
    const visibleResults = SourceResults.slice(0, 3);
    const restResults = SourceResults.slice(3);

    return (
        <div className="flex flex-row gap-2 w-full">
                {visibleResults.map((result: any, index: any) => (
                    <Link key={index} href={result.url} className="w-1/4 h-full">
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
                                <CardContent className="flex items-center justify-center h-full">
                                    <p className="text-base font-semibold">+{restResults.length} more</p>
                                </CardContent>
                            </Card>
                        </SheetTrigger>
                        <SheetContent className="sm:max-w-[600px] overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle>Additional Sources</SheetTitle>
                                <SheetDescription>
                                    Here are the remaining sources from your search.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="flex flex-col gap-4 mt-4 max-h-[calc(100vh-120px)]">
                                {restResults.map((result: any, index: number) => (
                                    <Link key={index} href={result.url} className="w-full h-1/2">
                                        <Card className="h-full">
                                            <CardHeader className="py-2">
                                                <CardTitle className="text-xs truncate">{result.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="py-1">
                                                <span className="text-blue-600 hover:underline block mb-1 text-xs truncate">{result.url}</span>
                                                <p className="text-xs line-clamp-2">{result.description}</p>
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
