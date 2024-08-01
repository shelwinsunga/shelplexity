"use client";

import { useState, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFrontend } from "@/contexts/FrontendContext";
import Loading from "./Loading";
import { Snail } from "lucide-react";

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
    return (
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%]">
        <div className="flex flex-col items-start justify-start min-h-screen">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto -mt-16 px-4 py-8 relative flex flex-col items-center justify-center h-screen">
      <div className="flex items-center mb-8">
        <Snail className="w-12 h-12 mr-4" />
        <h1 className="text-3xl font-semibold">Shelplexity</h1>
      </div>
      <div className="w-full max-w-2xl">
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
        </div>{" "}
      </div>
    </div>
  );
}
