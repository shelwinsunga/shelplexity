'use client'
import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClientMessage } from '@/app/actions';
import { useActions, useUIState } from 'ai/rsc';
import { generateId } from 'ai';
import { useEffect } from 'react';
import { useAIState } from 'ai/rsc';
import { useSearchParams } from 'next/navigation';
import { generateHash } from '@/lib/utils';


interface FrontendContextType {
  query: string;
  queryId: string;
  handleQuery: (query: string) => void;
  setQuery: (query: string) => void;
  setQueryId: (queryId: string) => void;
}

const FrontendContext = createContext<FrontendContextType | undefined>(undefined);

export function FrontendProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');
  const [queryId, setQueryId] = useState('');
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();
  const [AIState, setAIState] = useAIState();
  const searchParams = useSearchParams();
  const router = useRouter();


  const handleQuery = async (newQuery: string) => {
    setQuery(newQuery);
    router.push(`/search?q=pending`);

    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      { id: generateId(), role: 'user', display: newQuery },
    ]);

    const message = await continueConversation(newQuery);

    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      message,
    ]);
  };

  useEffect(() => {
    if (searchParams.get('q') === 'pending') {
      const slug = query.toLowerCase().replace(/\s+/g, '-');
      const hash = generateHash();
      const finalUrl = `/search/${slug}-${hash}`;
      router.push(finalUrl);
    }
  }, [AIState, router]);

  return (
    <FrontendContext.Provider value={{ query, queryId, handleQuery, setQuery, setQueryId }}>
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
