// @ts-nocheck
"use client";
import { useEffect, useState, useMemo } from "react";
import { ClientMessage } from "@/app/actions";
import { useUIState } from "ai/rsc";
import { useFrontend } from "@/contexts/FrontendContext";
import { SearchTextRender } from "./SearchTextRender";
import ReactMarkdown from "react-markdown";
import { visit } from 'unist-util-visit';



export function SearchResultsDisplay() {
    const { message } = useFrontend();
    const [displayedContent, setDisplayedContent] = useState<React.ReactNode[]>(
        []
    );
    const [currentIndex, setCurrentIndex] = useState(0);

    const blocks = useMemo(() => {
        const processedBlocks: string[] = [];
        let buffer = '';
        setDisplayedContent([
            <SearchTextRender>
                {message}
            </SearchTextRender>
        ]);
    }, [message]);

    const animateBlock = (block: string, index: number) => {
        return (
            <span className="fade-in" key={index}>{block}</span>
        )
    }

    return (
        <div className="mt-2 flex flex-col items-start justify-start w-full max-w-full overflow-x-hidden">
            <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl w-full">
                {displayedContent}
            </div>
            {/* {conversation.map(
                (message: ClientMessage) =>
                    message.role === "assistant" && (
                        <div
                            className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl w-full"
                            key={message.id}
                        >
                            <div className="mt-8 w-full">
                                <AnimatedTextWrapper>{message.display}</AnimatedTextWrapper>
                            </div>
                        </div>
                    )
            )} */}
        </div>
    );
}