'use client';

import { useState, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFrontend } from '@/contexts/FrontendContext';

export function SearchArea() {
  const { query, setQuery, setQueryId } = useFrontend();
  const router = useRouter();

  const handleSearch = async () => {
    if (query.trim()) {
      const hash = generateHash();
      setQuery(query);
      setQueryId(hash);
      const pendingUrl = `/search?q=pending`;
      router.push(pendingUrl);

      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const slug = query.toLowerCase().replace(/\s+/g, '-');
        const finalUrl = `/search/${slug}-${hash}`;
        router.push(finalUrl);
      } catch (error) {
        console.error('Search failed:', error);
        router.push('/search?error=true');
      }
    }
  };

  return (
    <div className="flex flex-row items-end gap-2 rounded-md border bg-card shadow-md p-4">
      <Textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSearch();
          }
        }}
        placeholder="Ask anything"
        className="border-none min-h-[120px] bg-transparent w-full resize-none focus-visible:outline-none"
      />
      <AnimatePresence>
        {query.trim() && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Button onClick={handleSearch} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Send className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function generateHash() {
  return Math.random().toString(36).substring(2, 15);
}