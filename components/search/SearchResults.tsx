'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function SearchResults({ children }: { children: React.ReactNode }) {
  return (
    <div className="search-results">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children as string}</ReactMarkdown>
    </div>
  );
}