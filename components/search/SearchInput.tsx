'use client';

import { useState, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchInput() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
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
    <div className="flex gap-2">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Ask anything..."
        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
}

function generateHash() {
  return Math.random().toString(36).substring(2, 15);
}