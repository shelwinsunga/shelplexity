'use client';

import { useState, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from 'lucide-react';

export function SearchArea() {
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
    <div className="flex flex-row gap-2 rounded-md border  bg-card shadow-md bg-muted">
      <Textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Ask anything..."
        className="border-none min-h-[120px] bg-card w-full p-4 resize-none transition-all duration-200 ease-in-out"
      />
      {query.trim() && (
        <Button onClick={handleSearch}>Search</Button>
      )}
    </div>
  );
}

function generateHash() {
  return Math.random().toString(36).substring(2, 15);
}