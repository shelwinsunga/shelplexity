import { Skeleton } from "@/components/ui/skeleton";
import { Snail } from "lucide-react";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-start sm:justify-center min-h-screen">
      <div className="flex items-center mb-8">
        <Snail className="w-8 h-8 sm:w-12 sm:h-12 mr-2 sm:mr-4" />
        <Skeleton className="h-8 sm:h-9 w-36 sm:w-48" />{" "}
        {/* Skeleton for the title */}
      </div>
      <div className="w-full max-w-2xl sm:mt-0 mt-4">
        <div className="flex flex-col gap-2 rounded-md border bg-card shadow-md p-4">
          <Skeleton className="h-[80px] w-full" />{" "}
          {/* Skeleton for the textarea */}
        </div>
      </div>
    </div>
  );
}
