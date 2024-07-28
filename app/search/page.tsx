'use client';

import { useState, useEffect } from 'react';
import { ClientMessage } from '../actions';
import { useActions, useUIState } from 'ai/rsc';
import { generateId } from 'ai';
import { useRouter } from 'next/navigation';
import { useFrontend } from '@/contexts/FrontendContext';

export const maxDuration = 30;

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();
  const { query, setQuery } = useFrontend();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div>
        {conversation.map((message: ClientMessage) => (
          <div key={message.id}>
            {message.role}: {message.display}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={event => {
          setInput(event.target.value);
        }}
      />
      <button
        className="bg-blue-500 text-white p-2 rounded-md"
        onClick={async () => {
          setQuery(input);
          // create new frontend context
          // store query in the frontend context
          // store status of query in the frontend 

          // setConversation((currentConversation: ClientMessage[]) => [
          //   ...currentConversation,
          //   { id: generateId(), role: 'user', display: input },
          // ]);

          // const message = await continueConversation(input);

          // setConversation((currentConversation: ClientMessage[]) => [
          //   ...currentConversation,
          //   message,
          // ]);
        }}
      ></button>
    </div>
  );
}