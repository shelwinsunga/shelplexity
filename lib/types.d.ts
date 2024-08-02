"use client";
export type QueryStatus = "pending" | "complete" | "error";

export interface FrontendContextType {
  query: string | null;
  handleQuery: (query: string) => void;
  setQuery: (query: string) => void;
  frontendContextId: string | null;
  setFrontendContextId: (frontendContextId: string | null) => void;
  sourceResults: any;
  setSourceResults: (sourceResults: any) => void;
  recentThreads: any[];
  message: any;
  setMessage: (message: any) => void;
  updateRecentThreads: () => void;
  searchProgress: any;
  setSearchProgress: (searchProgress: any) => void;
}
