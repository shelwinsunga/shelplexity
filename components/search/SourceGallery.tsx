'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";

export default function SourceGallery({ SourceResults }: { SourceResults: any }) {
    const visibleResults = SourceResults.slice(0, 3);
    const restResults = SourceResults.slice(3);

    return (
        <div className="flex overflow-x-auto space-x-4">
            {visibleResults.map((result: any, index: any) => (
                <Card key={index} className="flex-shrink-0 w-64">
                    <CardHeader>
                        <CardTitle className="text-sm truncate">{result.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <a href={result.url} className="text-blue-600 hover:underline block mb-2 text-xs truncate">{result.url}</a>
                        <p className="text-xs line-clamp-3">{result.description}</p>
                    </CardContent>
                </Card>
            ))}
            {restResults.length > 0 && (
                <Sheet>
                    <SheetTrigger asChild>
                        <Card className="flex-shrink-0 w-64 cursor-pointer">
                            <CardContent className="flex items-center justify-center h-full">
                                <p className="text-lg font-semibold">+{restResults.length} more</p>
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
                                <Card key={index} className="w-full">
                                    <CardHeader>
                                        <CardTitle className="text-sm truncate">{result.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <a href={result.url} className="text-blue-600 hover:underline block mb-2 text-xs truncate">{result.url}</a>
                                        <p className="text-xs line-clamp-3">{result.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </div>
    );
}
