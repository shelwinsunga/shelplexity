// @ts-nocheck
"use client";
import { useEffect, useState, useMemo } from "react";
import { ClientMessage } from "@/app/actions";
import { useUIState } from "ai/rsc";
import { useFrontend } from "@/contexts/FrontendContext";
import { SearchTextRender } from "./SearchTextRender";
import ReactMarkdown from "react-markdown";

export function SearchResultsDisplay() {
  const { message } = useFrontend();
  const [conversation] = useUIState();
  const [displayedContent, setDisplayedContent] = useState<React.ReactNode[]>(
    []
  );

  const blocks = useMemo(() => {
    setDisplayedContent([
      <SearchTextRender key="search-text-render">{message}</SearchTextRender>,
    ]);
  }, [message]);

  return (
    <div className="mt-2 flex flex-col items-start justify-start w-full max-w-full overflow-x-hidden">
      {conversation.map(
        (message: ClientMessage) =>
          message.role === "assistant" && (
            <div
              className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl w-full"
              key={message.id}
            >
              {message.display}
              {displayedContent}
            </div>
          )
      )}
    </div>
  );
}
