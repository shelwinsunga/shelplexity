'use client';

import { useState, useEffect } from 'react';
import { ClientMessage } from '@/app/actions';
import { useUIState } from 'ai/rsc';

export const maxDuration = 30;

export default function Home() {
  const [conversation] = useUIState();
  useEffect(() => {
    console.log(conversation);
  }, [conversation]);


  return (
    <div className="flex flex-col items-start justify-start border h-screen">
      {conversation.map((message: ClientMessage) => (
        message.role === 'assistant' && (
          <div className="prose" key={message.id}>
            {message.display}
          </div>
        )
      ))}
    </div>
  );
}