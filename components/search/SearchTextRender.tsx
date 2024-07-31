'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { ComponentPropsWithoutRef } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Snail } from 'lucide-react'

export function SearchTextRender({ children }: { children: React.ReactNode }) {
  const content = children as string;
  const containsLaTeX = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/.test(content || '')
  const processedData = preprocessLaTeX(content || '')

  const components = {
    a: ({ children, ...props }: ComponentPropsWithoutRef<'a'>) => (
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <a className={`${typeof children === 'string' && !isNaN(Number(children)) && children.trim().split(' ').length === 1
            ? 'p-1 opacity-90 bg-foreground/15 border m-1 text-[11px] rounded-md'
            : 'text-xs sm:text-sm md:text-base bg-foreground/10 hover:bg-card/10 shadow-md border text-accent-foreground rounded ml-1 px-1.5 py-0.5 no-underline hover:no-underline'
            }`} {...props}>
            {typeof children === 'string' && !isNaN(Number(children)) && children.trim().split(' ').length === 1
              ? <span className="numeric-content">{children}</span>
              : children}
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs sm:text-sm">{props.href}</p>
        </TooltipContent>
      </Tooltip>
    ),
    h1: ({ children, ...props }: ComponentPropsWithoutRef<'h1'>) => {
      if (children === 'Answer') {
        return (
          <h3 className='font-semibold flex items-center text-lg sm:text-xl md:text-2xl' {...props}>
            <Snail className='w-5 h-5 sm:w-6 sm:h-6 mr-2' />
            {children}
          </h3>
        );
      }
      return null;
    },
  };

  const processContent = (content: string | null) => {
    if (content === null) return '';
    return content.replace('<answer>', '# Answer').replace('</answer>', '');
  };

  if (containsLaTeX) {
    return (
      <div className="prose prose-sm sm:prose md:prose-lg lg:prose-xl mb-20 max-w-full">
        <ReactMarkdown
          rehypePlugins={[
            rehypeKatex
          ]}
          remarkPlugins={[remarkGfm, remarkMath]}
          className="prose-neutral"
          components={components}
        >
          {processContent(processedData)}
        </ReactMarkdown>
      </div>
    )
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
  )
}

const preprocessLaTeX = (content: string) => {
  const blockProcessedContent = content.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_, equation) => `$$${equation}$$`
  )
  const inlineProcessedContent = blockProcessedContent.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_, equation) => `$${equation}$`
  )
  return inlineProcessedContent
}