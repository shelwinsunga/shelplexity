'use server';

import { createAI, getMutableAIState, streamUI } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { ReactNode } from 'react';
import { z } from 'zod';
import { generateId } from 'ai';
import { SearchTextRender } from '@/components/search/SearchTextRender';
import { createStreamableValue, StreamableValue } from 'ai/rsc';
import { searchWeb } from '@/actions/searchWeb';
import { saveConversationToThread } from '@/actions/threadActions';
import { saveThreadSourceResults } from '@/actions/threadActions';
import { systemPrompt } from '@/lib/prompt';

export interface ServerMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ClientMessage {
    id: string;
    role: 'user' | 'assistant';
    display: ReactNode;
    isComplete?: StreamableValue<boolean, any>;
}



export async function continueConversation(
    input: string,
    indexedPath: string,
): Promise<ClientMessage> {
    'use server';

    const history = getMutableAIState();
    history.update([]);

    const isComplete = createStreamableValue(false);

    const webResults = await searchWeb(input);
    await saveThreadSourceResults(indexedPath, webResults);

    const parsedWebResults = Array.isArray(webResults)
        ? (typeof webResults === 'string'
            ? JSON.parse(webResults)
            : webResults
        ).map((result: any, index: number) => ({
            url: result.url,
            description: result.description,
            index: index + 1
        }))
        : [];

    const result = await streamUI({
        model: openai('gpt-4o'),
        system: systemPrompt(input, parsedWebResults),
        messages: (() => {
            const messages = [...history.get(), { role: 'user', content: input }];
            return messages;
        })(),
        text: async ({ content, done }) => {
            if (done) {
                history.done((messages: ServerMessage[]) => [
                    ...messages,
                    { role: 'assistant', content },
                ]);
                isComplete.done(true);
                await saveConversationToThread(indexedPath, content);
            }
            return <SearchTextRender>
                {content}
            </SearchTextRender>;
        },
    });

    return {
        id: generateId(),
        role: 'assistant',
        display: result.value,
        isComplete: isComplete.value,
    };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
    actions: {
        continueConversation,
    },
    initialAIState: [],
    initialUIState: [],
});