'use client';

import { useState, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function SearchInput() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = async () => {
    if (query.trim()) {
      const pendingUrl = `/search?q=pending`;
      router.push(pendingUrl);

      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const slug = query.toLowerCase().replace(/\s+/g, '-');
        const finalUrl = `/search/${slug}-${generateHash()}`;
        router.push(finalUrl);
      } catch (error) {
        console.error('Search failed:', error);
        router.push('/search?error=true');
      }
    }
  };

  return (
    <div className="flex gap-2">
      <Textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Ask anything..."
        className="w-full p-2 resize-none overflow-y-auto min-h-[40px] max-h-[28rem] transition-all duration-200 ease-in-out"
        style={{ height: 'auto' }}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = 'auto';
          target.style.height = `${Math.min(target.scrollHeight, 448)}px`;
        }}
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
}

function generateHash() {
  return Math.random().toString(36).substring(2, 15);
}