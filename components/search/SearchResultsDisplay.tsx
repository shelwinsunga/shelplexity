'use client';

import { ClientMessage } from '@/app/actions';
import { useUIState } from 'ai/rsc';

interface SearchResultsDisplayProps {
    conversation: ClientMessage[];
}

export function SearchResultsDisplay() {
    const [conversation] = useUIState();

    return (
        <div className="mt-2 flex flex-col items-start justify-start w-full max-w-full overflow-x-hidden">
            {conversation.map((message: ClientMessage) => (
                message.role === 'assistant' && (
                    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl w-full" key={message.id}>
                        <div className="mt-8 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">

                            {message.display}
                        </div>
                    </div>
                )
            ))}
        </div>
    );
}
