'use client';

import { useState, useEffect } from 'react';
import { ClientMessage } from '@/app/actions';
import { useActions, useUIState } from 'ai/rsc';
import { generateId } from 'ai';
import { useRouter } from 'next/navigation';
import { useFrontend } from '@/contexts/FrontendContext';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { readStreamableValue } from 'ai/rsc';

export const maxDuration = 30;

export default function Home() {
  const [conversation] = useUIState();
  useEffect(() => {
    console.log(conversation);
  }, [conversation]);


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div>
        {conversation.map((message: ClientMessage) => (
          <div key={message.id}>
            {message.display}
          </div>
        ))}
      </div>
    </div>
  );
}