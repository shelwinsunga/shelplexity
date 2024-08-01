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
import { searchWebImage } from '@/actions/searchWebImage';
import { performance } from 'perf_hooks';

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

    console.time('continueConversation');
    const startTime = performance.now();

    const history = getMutableAIState();
    history.update([]);

    const isComplete = createStreamableValue(false);

    console.time('webSearches');
    const webResults = await searchWeb(input, 15);
    const webImageResults = await searchWebImage(input);
    console.timeEnd('webSearches');

    if (webImageResults !== null) {
        console.log('\x1b[32mwebImageResults retrieved\x1b[0m');
    } else {
        console.log('\x1b[31mwebImageResults not retrieved\x1b[0m');
    }
    await saveThreadSourceResults(indexedPath, webResults, webImageResults);

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

    console.time('streamUI');
    const result = await streamUI({
        model: openai('gpt-4o'),
        system: systemPrompt(),
        messages: (() => {
            const messages = [...history.get(), { role: 'user', content: input }];
            return messages;
        })(),
        maxTokens: 500,
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
                        .max(4)
                        .describe('Search objective'),
                }),
                generate: async function* ({ queries }) {
                    const searchQueries: SearchQuery[] = queries.map(query => ({ query, status: 'searching' }));
                    const results = []
                    yield <SearchLoading queries={searchQueries} />;

                    for (let i = 0; i < searchQueries.length; i++) {
                        results.push({ [searchQueries[i].query]: await searchWeb(searchQueries[i].query, 3) });
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

                    console.time('streamText');
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
                    history.done((messages: ServerMessage[]) => [
                        ...messages,
                        { role: 'assistant', content: accumulatedText },
                    ]);
                    isComplete.done(true);
                    await saveConversationToThread(indexedPath, accumulatedText);
                    return <SearchTextRender>{accumulatedText}</SearchTextRender>;
                },
            },
        },
    });
    console.timeEnd('streamUI');

    const endTime = performance.now();
    console.log(`continueConversation execution time: ${endTime - startTime} milliseconds`);
    console.timeEnd('continueConversation');

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