'use client';

import { ClientMessage } from '@/app/actions';
import { useUIState } from 'ai/rsc';

interface SearchResultsDisplayProps {
    conversation: ClientMessage[];
}

export function SearchResultsDisplay() {
    const [conversation] = useUIState();

    return (
        <div className="flex flex-col items-start justify-start w-full max-w-full overflow-x-hidden">
            {conversation.map((message: ClientMessage) => (
                message.role === 'assistant' && (
                    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-full" key={message.id}>
                        {message.display}
                    </div>
                )
            ))}
        </div>
    );
}
