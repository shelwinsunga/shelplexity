'use client';

import { ClientMessage } from '@/app/actions';
import { useUIState } from 'ai/rsc';

export function SearchResultsDisplay() {
    const [conversation] = useUIState();

    return (
        <div className="mt-2 flex flex-col items-start justify-start w-full max-w-full overflow-x-hidden">
            {conversation.map((message: ClientMessage) => (
                message.role === 'assistant' && (
                    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl w-full" key={message.id}>
                        <div className="mt-8 w-full">

                            {message.display}
                        </div>
                    </div>
                )
            ))}
        </div>
    );
}
