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
import { performance } from 'perf_hooks';
import { saveThreadSourceResults } from '@/actions/threadActions';

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

const systemPrompt = (input: string, parsedWebResults: { url: string; description: string }[]): string => {
    return `You are an intelligent search engine assistant. Your primary role is to help users find information based on their queries. You will be provided with search results relevant to the user's input. Use these results to formulate comprehensive, accurate, and helpful responses.

Here are the search results related to the user's query:

${parsedWebResults.map((result, index) => `${index + 1}. ${result.url}: ${result.description}`).join('\n')}

Carefully review the search results provided above. Use the information from these results to answer the user's query. If the search results do not contain relevant information to answer the query, state that you don't have enough information to provide an accurate response.

Format your answer using the following guidelines:
1. Use markdown formatting for your response.
2. Create hyperlinks using the URLs and descriptions from the search results.
3. Use footnotes in the format [n] to reference your sources, where n is an integer starting from 1. For example: [1](https://www.example.com/page).
4. Always include the footnote number [n] before the hyperlink.
5. Do not create hyperlinks without the [n] notation.

When answering the user's query:
1. Provide a clear and concise introduction to the topic.
2. Include relevant facts, figures, and details from the search results.
3. Organize information in a logical manner, using bullet points or numbered lists when appropriate.
4. If the query asks for an opinion or recommendation, clearly state that your response is based on the available information and not a personal opinion.
5. If there are multiple perspectives on a topic, present them objectively.

If you cannot answer the user's query based on the provided search results:
1. Clearly state that you don't have enough information to provide an accurate answer.
2. Suggest related topics or alternative queries that the user might find helpful, based on the available search results.

Now, please answer the following user query:

${input}

Provide your response inside <answer> tags.`;
};

export async function continueConversation(
    input: string,
    indexedPath: string,
): Promise<ClientMessage> {
    'use server';
    console.log('Starting continueConversation function');
    const startTime = performance.now();

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

    console.log('Starting streamUI');
    const streamUIStartTime = performance.now();
    const result = await streamUI({
        model: openai('gpt-4o'),
        system: systemPrompt(input, parsedWebResults),
        messages: (() => {
            const messages = [...history.get(), { role: 'user', content: input }];
            return messages;
        })(),
        text: async ({ content, done }) => {
            if (done) {
                console.log('Updating history and saving conversation');
                const saveStartTime = performance.now();
                history.done((messages: ServerMessage[]) => [
                    ...messages,
                    { role: 'assistant', content },
                ]);
                isComplete.done(true);
                await saveConversationToThread(indexedPath, content);
                console.log(`Conversation saved. Time taken: ${performance.now() - saveStartTime} ms`);
            }
            return <SearchTextRender>
                {content}
            </SearchTextRender>;
        },
    });
    console.log(`streamUI completed. Time taken: ${performance.now() - streamUIStartTime} ms`);

    const endTime = performance.now();
    console.log(`Ending continueConversation function. Total execution time: ${endTime - startTime} ms`);

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