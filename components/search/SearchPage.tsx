"use client";

import { useState, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Snail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFrontend } from "@/contexts/FrontendContext";
import Loading from "./Loading";

export function SearchPage({ onClose }: { onClose?: () => void }) {
  const [localQuery, setLocalQuery] = useState("");
  const { query, handleQuery, setQuery } = useFrontend();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const currentQuery = searchParams.get("q");
  if (currentQuery && currentQuery !== query) {
    setQuery(currentQuery);
  }

  const handleSearch = async () => {
    if (localQuery && localQuery.trim() !== "") {
      setIsLoading(true);
      handleQuery(localQuery);
      if (onClose) {
        onClose();
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-start sm:justify-center min-h-screen">
      <div className="flex items-center mb-8">
        <Snail className="w-8 h-8 sm:w-12 sm:h-12 mr-2 sm:mr-4" />
        <h1 className="text-2xl sm:text-3xl font-semibold">Shelplexity</h1>
      </div>
      <div className="w-full max-w-2xl sm:mt-0 mt-4">
        <div className="flex flex-col gap-2 rounded-md border bg-card shadow-md p-4">
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
            className="border-none min-h-[80px] bg-transparent w-full resize-none focus-visible:outline-none"
          />
          <AnimatePresence>
            {localQuery && localQuery.trim() !== "" && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="self-end"
              >
                <Button
                  onClick={handleSearch}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Send className="w-4 h-4 mr-2" />
                  <span>Search</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
