import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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