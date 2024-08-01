"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { SearchContainer } from "@/app/search/layout";

export default function Loading() {
  return (
    <SearchContainer>
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex h-full w-full"
      >
        <div className="h-full w-full flex gap-12">
          <div className="flex-grow w-2/3">
            {/* Search Header Skeleton */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </motion.div>

            {/* Sources Skeleton */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full mb-8"
            >
              <Skeleton className="h-8 w-40 mb-4" />
              <div className="flex flex-row gap-2 w-full">
                {[...Array(3)].map((_, index) => (
                  <Card key={`source-${index}`} className="w-1/4 h-32">
                    <CardHeader className="py-3 px-3">
                      <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent className="pb-3 pt-1 px-3">
                      <div className="flex items-center">
                        <Skeleton className="h-4 w-4 rounded-full mr-2" />
                        <div className="flex items-center gap-1">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-3 w-3" />
                          <Skeleton className="h-3 w-3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Card className="flex-shrink-0 w-1/4 h-32">
                  <CardContent className="flex items-center justify-center h-full">
                    <Skeleton className="h-6 w-20" />
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Search Results Skeleton */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="w-full h-full"
            >
              <div className="flex flex-col items-start justify-start space-y-6">
                {[...Array(3)].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="w-full"
                  >
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Image Gallery Skeleton */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="w-1/4 h-full"
          >
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                >
                  <Skeleton
                    className={`h-32 ${index === 0 ? "col-span-2" : ""}`}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        </motion.div>
      </AnimatePresence>
    </SearchContainer>
  );
}
