"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Snail, CircleCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useFrontend } from "@/contexts/FrontendContext";
import { AnimatePresence, motion } from "framer-motion";

export interface SearchQuery {
  query: string;
  status: "searching" | "complete";
}

export function SearchLoading() {
  const { searchProgress } = useFrontend();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (Array.isArray(searchProgress) && searchProgress.length > 0) {
      setIsVisible(true);
      const allComplete = searchProgress.every(
        (query) => query.status === "complete"
      );
      if (allComplete) {
        setIsVisible(false);
      }
    }
  }, [searchProgress]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Card className="w-full mt-4">
            <CardContent className="p-4 w-full">
              <div className="flex items-center mb-2 h-[36px] ">
                <Snail className="w-6 h-6 mr-2" />
                <div className="text-lg font-semibold">Deep Search</div>
              </div>
              <Separator className="my-4" />
              {searchProgress.map((query: SearchQuery, index: number) => (
                <div key={index} className="flex items-center mb-2 last:mb-0">
                  <span className="relative flex h-4 w-4 mr-3">
                    {query.status === "searching" ? (
                      <>
                        <motion.span
                          className="ml-[2px] mt-0.5 absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <span className="ml-[2px] mt-0.5 relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
                      </>
                    ) : (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      >
                        <CircleCheck className="h-4 w-4 text-green-500" />
                      </motion.span>
                    )}
                  </span>
                  <span className="">{query.query}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
