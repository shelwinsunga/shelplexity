'use client';

import { useState } from 'react';
import { ClientMessage } from './actions';
import { useActions, useUIState } from 'ai/rsc';
import { generateId } from 'ai';
import { useFrontend } from '@/contexts/FrontendContext';

export const maxDuration = 30;

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();
  const { query, handleQuery } = useFrontend();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div>
        {conversation.map((message: ClientMessage) => (
          <div key={message.id}>
            {message.role}: {message.display}
          </div>
        ))}
      </div>

      <div>
        <input
          type="text"
          value={input}
          onChange={event => {
            setInput(event.target.value);
          }}
        />
        <button
          onClick={async () => {
            handleQuery(input);
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
        >
          Send Message
        </button>
      </div>
    </div>
  );
}