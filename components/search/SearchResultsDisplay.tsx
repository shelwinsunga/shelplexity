'use client';

import { ClientMessage } from '@/app/actions';
import { useUIState } from 'ai/rsc';

interface SearchResultsDisplayProps {
    conversation: ClientMessage[];
}

export function SearchResultsDisplay() {
    const [conversation] = useUIState();

    return (
        <div className="flex flex-col items-start justify-start">
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
