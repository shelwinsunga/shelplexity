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
  TooltipProvider,
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
          <a className="text-xs bg-card hover:bg-card/10 shadow-md border text-accent-foreground rounded ml-1 px-1.5 py-0.5 no-underline hover:no-underline" {...props}>
            {children}
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p>{props.href}</p>
        </TooltipContent>
      </Tooltip>
    ),
    h1: ({ children, ...props }: ComponentPropsWithoutRef<'h1'>) => {
      if (children === 'Answer') {
        return (
          <h3 className='font-semibold flex items-center' {...props}>
            <Snail className='w-6 h-6 mr-2' />
            {children}
          </h3>
        );
      }
      return null;
    },
  };

  const processContent = (content: string) => {
    return content.replace('<answer>', '# Answer').replace('</answer>', '');
  };

  if (containsLaTeX) {
    return (
      <div className="prose mb-20">
        <ReactMarkdown
          rehypePlugins={[
            rehypeKatex
          ]}
          remarkPlugins={[remarkGfm, remarkMath]}
          className="prose-sm prose-neutral"
          components={components}
        >
          {processContent(processedData)}
        </ReactMarkdown>
      </div>
    )
  }
  return (
    <div className="prose mb-20">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className="prose-sm prose-neutral"
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