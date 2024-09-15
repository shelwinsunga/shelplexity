"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ClientMessage } from "@/app/actions";
import {
  useActions,
  useUIState,
  useAIState,
  readStreamableValue,
} from "ai/rsc";
import { generateId } from "ai";
import { v4 as uuidv4 } from "uuid";
import { saveFrontendContext } from "@/actions/threadActions";
import { getRecentThreads } from "@/actions/threadActions";
import { QueryStatus, FrontendContextType } from "@/lib/types";

const FrontendContext = createContext<FrontendContextType | undefined>(
  undefined
);

export function FrontendProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [frontendContextId, setFrontendContextId] = useState<string | null>(
    null
  );
  const [message, setMessage] = useState<any>(null);
  const [sourceResults, setSourceResults] = useState<any>([]);
  const [queryStatus, setQueryStatus] = useState<QueryStatus>("pending");
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();
  const [AIState, setAIState] = useAIState();
  const [searchProgress, setSearchProgress] = useState<any>([]);
  const router = useRouter();
  const [recentThreads, setRecentThreads] = useState<any[]>([]);



  const handleQuery = async (newQuery: string, newFrontendContextId: string) => {
    setAIState([]);
    setConversation([]);
    setSearchProgress([]);
    setMessage(null);
    const { indexedPath } = await saveFrontendContext(
      newFrontendContextId,
      newQuery,
      "pending"
    );
    setFrontendContextId(newFrontendContextId);
    setQuery(newQuery);
    setConversation([{ id: generateId(), role: "user", display: newQuery }]);
    const message = await continueConversation(newQuery, indexedPath);

    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      message,
    ]);

    await Promise.all([
      updateStreamableValue(message.searchProgress, setSearchProgress),
      updateStreamableValue(message.searchText, setMessage),
      updateStreamableValue(message.isComplete, async (complete) => {
        if (complete) {
          window.history.replaceState(null, "", indexedPath);
          await updateRecentThreads();
        }
      }),
    ]);
  };

  const updateStreamableValue = async (
    streamable: any,
    handler: (value: any) => void | Promise<void>
  ) => {
    try {
      for await (const value of readStreamableValue(streamable)) {
        await handler(value);
      }
    } catch (error) {
      console.error(`Error reading streamable value: ${error}`);
    }
  };

  const updateRecentThreads = useCallback(async () => {
    const threads = await getRecentThreads(10);
    setRecentThreads(threads);
  }, []);

  return (
    <FrontendContext.Provider
      value={{
        query,
        handleQuery,
        setQuery,
        frontendContextId,
        setFrontendContextId,
        sourceResults,
        setSourceResults,
        recentThreads,
        updateRecentThreads,
        message,
        setMessage,
        searchProgress,
      }}
    >
      {children}
    </FrontendContext.Provider>
  );
}

export function useFrontend() {
  const context = useContext(FrontendContext);
  if (context === undefined) {
    throw new Error("useFrontend must be used within a FrontendProvider");
  }
  return context;
}
