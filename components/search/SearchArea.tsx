"use client";

import { useState, KeyboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFrontend } from "@/contexts/FrontendContext";
import { v4 as uuidv4 } from "uuid";  

export function SearchArea({ onClose }: { onClose?: () => void }) {
  const [localQuery, setLocalQuery] = useState("");
  const { query, handleQuery, setQuery } = useFrontend();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const currentQuery = searchParams.get("q");
  if (currentQuery && currentQuery !== query) {
    setQuery(currentQuery);
  }

  const handleRouterPush = (newFrontendContextId: string) => {
    router.push(
      `/search?q=pending&newFrontendContextUUID=${newFrontendContextId}`
    );
  };

  const handleSearch = async () => {
    if (localQuery && localQuery.trim() !== "") {
      setIsLoading(true);
      if (onClose) {
        onClose();
      }
    }
  };

  if (isLoading) {
    const newFrontendContextId = generateHash();
    handleRouterPush(newFrontendContextId);
    handleQuery(localQuery, newFrontendContextId);

    return (
      <div className="flex items-center justify-center h-[120px] rounded-md border bg-card shadow-md p-4">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-end gap-2 rounded-md border bg-card shadow-md p-4">
      <Textarea
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSearch();
          }
        }}
        placeholder="Ask anything"
        className="border-none min-h-[80px] sm:min-h-[120px] bg-transparent w-full resize-none focus-visible:outline-none"
      />
      <AnimatePresence>
        {query && query.trim() !== "" && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="mt-2 sm:mt-0"
          >
            <Button
              onClick={handleSearch}
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
            >
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
