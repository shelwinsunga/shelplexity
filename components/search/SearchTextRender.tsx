'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { ComponentPropsWithoutRef } from 'react'

export function SearchTextRender({ children }: { children: React.ReactNode }) {
  const content = children as string;
  const containsLaTeX = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/.test(content || '')
  const processedData = preprocessLaTeX(content || '')

  const components = {
    a: ({ children, ...props }: ComponentPropsWithoutRef<'a'>) => (
      <a className="bg-accent-foreground/10 text-accent-foreground rounded px-1 py-0.5" {...props}>
        {children}
      </a>
    ),
  };

  if (containsLaTeX) {
    return (
      <div className="prose">
        <ReactMarkdown
          rehypePlugins={[
            rehypeKatex
          ]}
          remarkPlugins={[remarkGfm, remarkMath]}
          className="prose-sm prose-neutral"
          components={components}
        >
          {processedData}
        </ReactMarkdown>
      </div>
    )
  }

  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className="prose-sm prose-neutral"
        components={components}
      >
        {content}
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