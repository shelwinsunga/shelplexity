'use client';

import { useState, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';

export function SearchInput() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      const pendingUrl = `/search?q=${encodeURIComponent(query)}&status=pending`;
      router.push(pendingUrl);
      
      // Simulate API call
      setTimeout(() => {
        const finalUrl = `/search/${encodeURIComponent(query)}-${generateHash()}`;
        router.push(finalUrl);
      }, 2000);
    }
  };

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Ask anything..."
      style={{ width: '100%', padding: '10px', fontSize: '16px' }}
    />
  );
}

function generateHash() {
  return Math.random().toString(36).substring(2, 15);
}