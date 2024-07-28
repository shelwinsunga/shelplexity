'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

export function SearchTextRender({ children }: { children: React.ReactNode }) {
  const content = children as string;
  const containsLaTeX = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/.test(content || '')
  const processedData = preprocessLaTeX(content || '')

  if (containsLaTeX) {
    return (
      <div className="prose">
        <ReactMarkdown
          rehypePlugins={[
            rehypeKatex
          ]}
          remarkPlugins={[remarkGfm, remarkMath]}
          className="prose-sm prose-neutral prose-a:text-accent-foreground/50"
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
        className="prose-sm prose-neutral prose-a:text-accent-foreground/50"
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