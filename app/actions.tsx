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
import { SearchLoading, SearchQuery } from '@/components/gen-ui/search-loading/search-loading';
import { userPrompt } from '@/lib/prompt';
import { streamText } from 'ai';

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

    function parseWebResults(webResults: any): Array<{ url: string; description: string; index: number }> {
        if (!Array.isArray(webResults)) {
            return [];
        }

        const results = typeof webResults === 'string' ? JSON.parse(webResults) : webResults;

        return results.map((result: any, index: number) => ({
            url: result.url,
            description: result.description,
            index: index + 1
        }));
    }

    const initialWebResults = parseWebResults(webResults);

    const result = await streamUI({
        model: openai('gpt-4o'),
        system: systemPrompt(),
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
        toolChoice: 'required', // force the model to call a tool
        tools: {
            search: {

                description: 'Search the web for information',
                parameters: z.object({
                    queries: z
                        .array(z.string())
                        .length(5)
                        .describe('Ten search objectives'),
                }),
                generate: async function* ({ queries }) {
                    const searchQueries: SearchQuery[] = queries.map(query => ({ query, status: 'searching' }));
                    const results = []
                    yield <SearchLoading queries={searchQueries} />;

                    for (let i = 0; i < searchQueries.length; i++) {
                        results.push({ [searchQueries[i].query]: await searchWeb(searchQueries[i].query) });
                        searchQueries[i].status = 'complete';
                        yield (
                            <>
                                <SearchLoading queries={searchQueries} />
                            </>
                        );
                    }

                    const deepParsedWebResults = results.reduce((acc, result) => {
                        const [query, webResults] = Object.entries(result)[0];
                        acc[query] = webResults.map((webResult: any) => ({
                            url: webResult.url,
                            description: webResult.description
                        }));
                        return acc;
                    }, {} as Record<string, Array<{ url: string; description: string }>>);

                    const prompt = userPrompt(input, initialWebResults, deepParsedWebResults);

                    const result = await streamText({
                        model: openai('gpt-4o-mini'),
                        system: systemPrompt(),
                        messages: [{ role: 'user', content: prompt }],
                    });

                    let accumulatedText = '';
                    for await (const textPart of result.textStream) {
                        accumulatedText += textPart;
                        yield (
                            <>

                                <SearchTextRender>{accumulatedText}</SearchTextRender>
                            </>
                        );
                    }
                    await saveConversationToThread(indexedPath, accumulatedText);
                    return <SearchTextRender>{accumulatedText}</SearchTextRender>;
                },
            },
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