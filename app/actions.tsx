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
                    yield <SearchLoading queries={searchQueries} />;

                    for (let i = 0; i < searchQueries.length; i++) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        searchQueries[i].status = 'complete';
                        yield (
                            <>
                                <SearchLoading queries={searchQueries} />
                            </>
                        );
                    }

                    // const result = await streamText({
                    //     model: openai('gpt-4o-mini'),
                    //     prompt: 'Invent a new holiday and describe its traditions.',
                    // });

                    // let accumulatedText = '';
                    // for await (const textPart of result.textStream) {
                    //     accumulatedText += textPart;
                    //     yield (
                    //         <>
                    //             <SearchProgress queries={searchQueries} />
                    //             <div>{accumulatedText}</div>
                    //         </>
                    //     );
                    // }

                    return <>
                        <SearchLoading queries={searchQueries} />
                        {/* <div>{accumulatedText}</div> */}
                    </>;
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