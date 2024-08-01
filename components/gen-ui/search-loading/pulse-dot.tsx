"use client";
import { CircleCheck } from "lucide-react";

export interface SearchQuery {
  query: string;
  status: "searching" | "complete";
}

export function PulseDot({ status }: { status: "searching" | "complete" }) {
  return (
    <span className="relative flex h-4 w-4 mr-3">
      {status === "searching" ? (
        <>
          <span className="ml-[2px] mt-0.5 animate-ping absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75"></span>
          <span className="ml-[2px] mt-0.5 relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </>
      ) : (
        <CircleCheck className="h-4 w-4 text-green-500" />
      )}
    </span>
  );
}
