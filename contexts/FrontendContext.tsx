'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ClientMessage } from '@/app/actions';
import { useActions, useUIState, useAIState, readStreamableValue } from 'ai/rsc';
import { generateId } from 'ai';
import { useSearchParams } from 'next/navigation';
import { generateHash } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { saveFrontendContext, createThread } from '@/actions/saveQuery';

interface FrontendContextType {
  query: string | null;
  handleQuery: (query: string) => void;
  setQuery: (query: string) => void;
  frontendContextId: string | null;
  setFrontendContextId: (frontendContextId: string | null) => void;
  sourceResults: any;
  setSourceResults: (sourceResults: any) => void;
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

  const handleQuery = async (newQuery: string) => {
    setAIState([]);
    setConversation([]);
    
    const newFrontendContextId = uuidv4();
    const { hash } = await saveFrontendContext(newFrontendContextId, newQuery, 'pending');
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
          const slug = query.toLowerCase().replace(/\s+/g, '-').slice(0, 26);
          const newPath = `/search/${slug}-${hash}`;
          window.history.replaceState(null, '', newPath);
        }
      }
    }
  };

  
  // useEffect(() => {
  //   if (searchParams.get('q') === 'pending') {
  //     const slug = query.toLowerCase().replace(/\s+/g, '-');
  //     const hash = generateHash();
  //     const newPath = `/search/${slug}-${hash}`;
  //     window.history.replaceState(null, '', newPath);
  //   }
  // }, [AIState, router]);

  return (
    <FrontendContext.Provider value={{ query, handleQuery, setQuery, frontendContextId, setFrontendContextId, sourceResults, setSourceResults }}>
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
