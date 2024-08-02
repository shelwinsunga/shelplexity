// @ts-nocheck
"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { ComponentPropsWithoutRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Snail } from "lucide-react";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FadeInWrapper = ({ children, duration = 1.0 }) => {

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration, ease: "easeIn" }}
    >
      {children}
    </motion.span>
  );
};




const FadeLessComponents = {
  p: ({ node, children, ...props }) => (
    <p {...props}>
      {children}
    </p>
  ),
  h1: ({ children, ...props }: ComponentPropsWithoutRef<"h1">) => {
    if (children === "Answer") {
      return (
        <h3
          className="font-semibold flex items-center text-lg sm:text-xl md:text-2xl"
          {...props}
        >
          <Snail className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          {children}
        </h3>
      );
    }
    return null;
  },
  h2: ({ node, ...props }) => <h2 {...props} />,
  h3: ({ node, ...props }) => <h3 {...props} />,
  h4: ({ node, ...props }) => <h4 {...props} />,
  h5: ({ node, ...props }) => <h5 {...props} />,
  h6: ({ node, ...props }) => <h6 {...props} />,
  blockquote: ({ node, ...props }) => <blockquote {...props} />,
  ul: ({ node, ...props }) => <ul {...props} />,
  ol: ({ node, ...props }) => <ol {...props} />,
  li: ({ node, ...props }) => <li {...props} />,
  strong: ({ node, ...props }) => <strong {...props} />,
  em: ({ node, ...props }) => <em {...props} />,
  code: ({ node, ...props }) => <code {...props} />,
  pre: ({ node, ...props }) => <pre {...props} />,
  img: ({ node, ...props }) => <img {...props} />,
  a: ({ children, ...props }: ComponentPropsWithoutRef<"a">) => (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <a
          className={`${typeof children === "string" &&
            !isNaN(Number(children)) &&
            children.trim().split(" ").length === 1
            ? "p-1 opacity-90 bg-foreground/15 border m-1 text-[11px] rounded-md"
            : "text-xs sm:text-sm md:text-base bg-foreground/10 hover:bg-card/10 shadow-md border text-accent-foreground rounded ml-1 px-1.5 py-0.5 no-underline hover:no-underline"
            }`}
          {...props}
        >
          {typeof children === "string" &&
            !isNaN(Number(children)) &&
            children.trim().split(" ").length === 1 ? (
            <span className="numeric-content">{children}</span>
          ) : (
            children
          )}
        </a>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs sm:text-sm">{props.href}</p>
      </TooltipContent>
    </Tooltip>
  ),
};

const FadeInComponents = {
  p: ({ node, children, ...props }) => (
    <p {...props}>
      {typeof children === 'string'
        ? children.split('').map((char, index) => (
          <FadeInWrapper key={index} duration={0.2}>
            {char}
          </FadeInWrapper>
        ))
        : children}
    </p>
  ),
  h1: ({ children, ...props }: ComponentPropsWithoutRef<"h1">) => {
    if (children === "Answer") {
      return (
        <FadeInWrapper duration={1.0}>
          <h3
            className="font-semibold flex items-center text-lg sm:text-xl md:text-2xl"
            {...props}
          >
            <Snail className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            {children}
          </h3>
        </FadeInWrapper>
      );
    }
    return null;
  },
  h2: ({ node, ...props }) => <FadeInWrapper><h2 {...props} /></FadeInWrapper>,
  h3: ({ node, ...props }) => <FadeInWrapper><h3 {...props} /></FadeInWrapper>,
  h4: ({ node, ...props }) => <FadeInWrapper><h4 {...props} /></FadeInWrapper>,
  h5: ({ node, ...props }) => <FadeInWrapper><h5 {...props} /></FadeInWrapper>,
  h6: ({ node, ...props }) => <FadeInWrapper><h6 {...props} /></FadeInWrapper>,
  blockquote: ({ node, ...props }) => <FadeInWrapper><blockquote {...props} /></FadeInWrapper>,
  ul: ({ node, ...props }) => <FadeInWrapper><ul {...props} /></FadeInWrapper>,
  ol: ({ node, ...props }) => <FadeInWrapper><ol {...props} /></FadeInWrapper>,
  li: ({ node, ...props }) => <FadeInWrapper><li {...props} /></FadeInWrapper>,
  strong: ({ node, ...props }) => <FadeInWrapper duration={0.2}><strong {...props} /></FadeInWrapper>,
  em: ({ node, ...props }) => <FadeInWrapper><em {...props} /></FadeInWrapper>,
  code: ({ node, ...props }) => <FadeInWrapper><code {...props} /></FadeInWrapper>,
  pre: ({ node, ...props }) => <FadeInWrapper><pre {...props} /></FadeInWrapper>,
  img: ({ node, ...props }) => <FadeInWrapper><img {...props} /></FadeInWrapper>,
  a: ({ children, ...props }: ComponentPropsWithoutRef<"a">) => (
    <FadeInWrapper duration={0.5}>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <a
            className={`${typeof children === "string" &&
              !isNaN(Number(children)) &&
              children.trim().split(" ").length === 1
              ? "p-1 opacity-90 bg-foreground/15 border m-1 text-[11px] rounded-md"
              : "text-xs sm:text-sm md:text-base bg-foreground/10 hover:bg-card/10 shadow-md border text-accent-foreground rounded ml-1 px-1.5 py-0.5 no-underline hover:no-underline"
              }`}
            {...props}
          >
            {typeof children === "string" &&
              !isNaN(Number(children)) &&
              children.trim().split(" ").length === 1 ? (
              <span className="numeric-content">{children}</span>
            ) : (
              children
            )}
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs sm:text-sm">{props.href}</p>
        </TooltipContent>
      </Tooltip>
    </FadeInWrapper>
  ),
};

export function SearchTextRender({ children, disableFade }: { children: React.ReactNode, disableFade?: boolean }) {
  const content = children as string;
  const containsLaTeX = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/.test(
    content || ""
  );
  const processedData = preprocessLaTeX(content || "");

  const processContent = (content: string | null) => {
    if (content === null) return "";
    let processedContent = content.replace("<answer>", "# Answer").replace("</answer>", "");
    processedContent = preprocessLinks(processedContent);
    return processedContent;
  };

  const components = disableFade ? FadeLessComponents : FadeInComponents;

  if (containsLaTeX) {
    return (
      <div className="prose prose-sm sm:prose md:prose-lg lg:prose-xl mb-20 max-w-full">
        <ReactMarkdown
          rehypePlugins={[rehypeKatex]}
          remarkPlugins={[remarkGfm, remarkMath]}
          className="prose-neutral"
          components={components}
        >
          {processContent(processedData)}
        </ReactMarkdown>
      </div>
    );
  }
  return (
    <div className="prose prose-sm sm:prose md:prose-lg lg:prose-xl mb-20 max-w-full">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className="prose-neutral"
        components={components}
      >
        {processContent(content)}
      </ReactMarkdown>
    </div>
  );
}

const preprocessLaTeX = (content: string) => {
  const blockProcessedContent = content.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_, equation) => `$$${equation}$$`
  );
  const inlineProcessedContent = blockProcessedContent.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_, equation) => `$${equation}$`
  );
  return inlineProcessedContent;
};

const preprocessLinks = (content: string) => {
  // Handle complete links
  let processedContent = content.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '[$1]($2)'
  );

  // Handle incomplete links (missing closing parenthesis)
  processedContent = processedContent.replace(
    /\[([^\]]+)\]\(([^)]+)$/gm,
    '[$1]($2)'
  );

  // Handle incomplete links (missing closing bracket)
  processedContent = processedContent.replace(
    /\[([^\]]+)$/gm,
    '[$1]'
  );

  return processedContent;
};
