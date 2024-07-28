'use client'
import { createContext, useContext, useState } from 'react';

interface FrontendContextType {
  query: string;
  queryId: string;
  setQuery: (query: string) => void;
  setQueryId: (queryId: string) => void;
}

const FrontendContext = createContext<FrontendContextType | undefined>(undefined);

export function FrontendProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');
  const [queryId, setQueryId] = useState('');

  return (
    <FrontendContext.Provider value={{ query, queryId, setQuery, setQueryId }}>
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
