'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ClientMessage } from '@/app/actions';
import { useActions, useUIState, useAIState, readStreamableValue } from 'ai/rsc';
import { generateId } from 'ai';
import { useSearchParams } from 'next/navigation';
import { generateHash } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { saveFrontendContext } from '@/actions/threadActions';
import { fetchRecentThreads } from '@/actions/fetchThreads';

interface FrontendContextType {
  query: string | null;
  handleQuery: (query: string) => void;
  setQuery: (query: string) => void;
  frontendContextId: string | null;
  setFrontendContextId: (frontendContextId: string | null) => void;
  sourceResults: any;
  setSourceResults: (sourceResults: any) => void;
  recentThreads: any[];
  updateRecentThreads: () => void;
}

const FrontendContext = createContext<FrontendContextType | undefined>(undefined);

export function FrontendProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');
  const [frontendContextId, setFrontendContextId] = useState<string | null>(null);
  const [sourceResults, setSourceResults] = useState<any>([]);
  const [queryStatus, setQueryStatus] = useState<'pending' | 'complete' | 'error'>('pending');
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();
  const [AIState, setAIState] = useAIState();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [recentThreads, setRecentThreads] = useState<any[]>([]);

  const updateRecentThreads = useCallback(async () => {
    const threads = await fetchRecentThreads();
    setRecentThreads(threads);
  }, []);

  const handleQuery = async (newQuery: string) => {
    setAIState([]);
    setConversation([]);

    const newFrontendContextId = uuidv4();
    const { indexedPath } = await saveFrontendContext(newFrontendContextId, newQuery, 'pending');
    setFrontendContextId(newFrontendContextId);
    setQuery(newQuery);
    router.push(`/search?q=${queryStatus}&newFrontendContextUUID=${newFrontendContextId}`);

    setConversation([
      { id: generateId(), role: 'user', display: newQuery },
    ]);

    const message = await continueConversation(newQuery);

    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      message,
    ]);

    if (message.isComplete) {
      for await (const complete of readStreamableValue(message.isComplete)) {
        if (complete) {
          window.history.replaceState(null, '', indexedPath);
          await updateRecentThreads();

        }
      }
    }
  };

  return (
    <FrontendContext.Provider value={{
      query, handleQuery, setQuery, frontendContextId, setFrontendContextId, sourceResults, setSourceResults, recentThreads,
      updateRecentThreads
    }}>
      {children}
    </FrontendContext.Provider>
  );
}

export function useFrontend() {
  const context = useContext(FrontendContext);
  if (context === undefined) {
    throw new Error('useFrontend must be used within a FrontendProvider');
  }
  return context;
}
