import { Skeleton } from "@/components/ui/skeleton";
import { Snail } from 'lucide-react';

export default function Loading() {
  return (
    <>
      <div className="container mx-auto -mt-16 px-4 py-8 relative flex flex-col items-center justify-center h-screen">
        <div className="flex items-center mb-8">
          <Snail className="w-12 h-12 mr-4" />
          <Skeleton className="h-9 w-48" /> {/* Skeleton for the title */}
        </div>
        <div className="w-full max-w-2xl">
          <div className="flex flex-row items-end gap-2 rounded-md border bg-card shadow-md p-4">
            <Skeleton className="h-[120px] w-full" /> {/* Skeleton for the textarea */}
            <Skeleton className="h-10 w-10" /> {/* Skeleton for the button */}
          </div>
        </div>
      </div>
    </>
  );
}