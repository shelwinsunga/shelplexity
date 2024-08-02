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

const CustomWrapper = ({ children }) => (
  <span className="fade-in">
    {children}
  </span>
);

const components1 = {
  p: ({ node, ...props }) => <CustomWrapper><p {...props} /></CustomWrapper>,
  h1: ({ children, ...props }: ComponentPropsWithoutRef<"h1">) => {
    if (children === "Answer") {
      return (
        <h3
          className="fade-in font-semibold flex items-center text-lg sm:text-xl md:text-2xl"
          {...props}
        >
          <Snail className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          {children}
        </h3>
      );
    }
    return null;
  },
  h2: ({ node, ...props }) => <CustomWrapper><h2 {...props} /></CustomWrapper>,
  h3: ({ node, ...props }) => <CustomWrapper><h3 {...props} /></CustomWrapper>,
  h4: ({ node, ...props }) => <CustomWrapper><h4 {...props} /></CustomWrapper>,
  h5: ({ node, ...props }) => <CustomWrapper><h5 {...props} /></CustomWrapper>,
  h6: ({ node, ...props }) => <CustomWrapper><h6 {...props} /></CustomWrapper>,
  blockquote: ({ node, ...props }) => <CustomWrapper><blockquote {...props} /></CustomWrapper>,
  ul: ({ node, ...props }) => <CustomWrapper><ul {...props} /></CustomWrapper>,
  ol: ({ node, ...props }) => <CustomWrapper><ol {...props} /></CustomWrapper>,
  li: ({ node, ...props }) => <CustomWrapper><li {...props} /></CustomWrapper>,
  strong: ({ node, ...props }) => <CustomWrapper><strong {...props} /></CustomWrapper>,
  em: ({ node, ...props }) => <CustomWrapper><em {...props} /></CustomWrapper>,
  code: ({ node, ...props }) => <CustomWrapper><code {...props} /></CustomWrapper>,
  pre: ({ node, ...props }) => <CustomWrapper><pre {...props} /></CustomWrapper>,
  img: ({ node, ...props }) => <CustomWrapper><img {...props} /></CustomWrapper>,
  a: ({ children, ...props }: ComponentPropsWithoutRef<"a">) => (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <a
          className={`${typeof children === "string" &&
            !isNaN(Number(children)) &&
            children.trim().split(" ").length === 1
            ? "fade-in p-1 opacity-90 bg-foreground/15 border m-1 text-[11px] rounded-md"
            : "fade-in text-xs sm:text-sm md:text-base bg-foreground/10 hover:bg-card/10 shadow-md border text-accent-foreground rounded ml-1 px-1.5 py-0.5 no-underline hover:no-underline"
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

export function SearchTextRender({ children }: { children: React.ReactNode }) {
  const content = children as string;
  const containsLaTeX = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/.test(
    content || ""
  );
  const processedData = preprocessLaTeX(content || "");

  const components = {
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
  };

  const processContent = (content: string | null) => {
    if (content === null) return "";
    let processedContent = content.replace("<answer>", "# Answer").replace("</answer>", "");
    processedContent = preprocessLinks(processedContent);
    return processedContent;
  };

  if (containsLaTeX) {
    return (
      <div className="prose prose-sm sm:prose md:prose-lg lg:prose-xl mb-20 max-w-full">
        <ReactMarkdown
          rehypePlugins={[rehypeKatex]}
          remarkPlugins={[remarkGfm, remarkMath]}
          className="prose-neutral"
          components={components1}
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
        components={components1}
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
  // Replace [text](url) with [text](url){:target="_blank" rel="noopener noreferrer"}
  return content.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '[$1]($2)'
  );
};
