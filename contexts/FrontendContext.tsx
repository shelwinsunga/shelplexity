'use client'
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ClientMessage } from '@/app/actions';
import { useActions, useUIState, useAIState, readStreamableValue } from 'ai/rsc';
import { generateId } from 'ai';
import { v4 as uuidv4 } from 'uuid';
import { saveFrontendContext } from '@/actions/threadActions';
import { getRecentThreads } from '@/actions/threadActions';

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
  const router = useRouter();
  const [recentThreads, setRecentThreads] = useState<any[]>([]);

  const updateRecentThreads = useCallback(async () => {
    const threads = await getRecentThreads(10);
    setRecentThreads(threads);
  }, []);

  const handleQuery = useCallback(async (newQuery: string) => {
    setAIState([]);
    setConversation([]);
    const newFrontendContextId = uuidv4();
    setFrontendContextId(newFrontendContextId);
    setQuery(newQuery);
    router.push(`/search?q=${newQuery}&newFrontendContextUUID=${newFrontendContextId}`);

    const { indexedPath } = await saveFrontendContext(newFrontendContextId, newQuery, 'pending');

    setConversation([
      { id: generateId(), role: 'user', display: newQuery },
    ]);

    return indexedPath;
  }, [setAIState, setConversation, router, setFrontendContextId, setQuery]);

  useEffect(() => {
    if (query && frontendContextId) {
      const generateConversation = async () => {
        const indexedPath = await handleQuery(query);
        const message = await continueConversation(query, indexedPath);

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

      generateConversation();
    }
  }, [query, frontendContextId, handleQuery, continueConversation, updateRecentThreads]);

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
