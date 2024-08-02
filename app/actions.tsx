"use server";

import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { ReactNode } from "react";
import { z } from "zod";
import { generateId } from "ai";
import { SearchTextRender } from "@/components/search/SearchTextRender";
import { createStreamableValue, StreamableValue } from "ai/rsc";
import { searchWeb } from "@/actions/searchWeb";
import { saveConversationToThread } from "@/actions/threadActions";
import { saveThreadSourceResults } from "@/actions/threadActions";
import { systemPrompt } from "@/lib/prompt";
import {
    SearchLoading,
    SearchQuery,
} from "@/components/gen-ui/search-loading/search-loading";
import { userPrompt } from "@/lib/prompt";
import { streamText } from "ai";
import { searchWebImage } from "@/actions/searchWebImage";
import { parseWebResults } from "@/lib/utils";
import { createStreamableUI } from "ai/rsc"

export interface ServerMessage {
    role: "user" | "assistant";
    content: string;
}

export interface ClientMessage {
    id: string;
    role: "user" | "assistant";
    display: ReactNode;
    isComplete?: StreamableValue<boolean, any>;
    searchText: any;
    searchProgress: any;
}

export async function continueConversation(
    input: string,
    indexedPath: string
): Promise<ClientMessage> {
    "use server";

    const history = getMutableAIState();
    history.update([]);


    const isComplete = createStreamableValue(false);
    const searchText = createStreamableValue('');
    const searchProgress = createStreamableValue<any>([]);

    const webResults = await searchWeb(input, 15);
    const webImageResults = await searchWebImage(input);

    await saveThreadSourceResults(indexedPath, webResults, webImageResults);

    const initialWebResults = parseWebResults(webResults);

    const result = await streamUI({
        model: openai("gpt-4o"),
        system: systemPrompt(),
        messages: (() => {
            const messages = [...history.get(), { role: "user", content: input }];
            return messages;
        })(),
        maxTokens: 500,
        text: async ({ content, done }) => {
            if (done) {
                history.done((messages: ServerMessage[]) => [
                    ...messages,
                    { role: "assistant", content },
                ]);
                isComplete.done(true);
                await saveConversationToThread(indexedPath, content);
            }
            return <SearchTextRender>{content}</SearchTextRender>;
        },
        temperature: 0.1,
        toolChoice: "required",
        tools: {
            search: {
                description: "Search the web for information",
                parameters: z.object({
                    queries: z.array(z.string()).max(4).describe("Search objective"),
                }),
                generate: async function* ({ queries }) {
                    const searchQueries: SearchQuery[] = queries.map((query) => ({
                        query,
                        status: "searching",
                    }));
                    const results = [];

                    for (let i = 0; i < searchQueries.length; i++) {
                        results.push({
                            [searchQueries[i].query]: await searchWeb(
                                searchQueries[i].query,
                                3
                            ),
                        });
                        await new Promise((resolve) => setTimeout(resolve, 1000));
                        searchQueries[i].status = "complete";
                        const updatedQueries = searchQueries.map(q => ({ ...q })); // Create a deep copy
                        searchProgress.update(updatedQueries);
                    }

                    const finalQueries = searchQueries.map(q => ({ ...q })); // Create a deep copy
                    searchProgress.done(finalQueries as any);

                    const deepParsedWebResults = results.reduce(
                        (acc, result) => {
                            const [query, webResults] = Object.entries(result)[0];
                            acc[query] = webResults.map((webResult: any) => ({
                                url: webResult.url,
                                description: webResult.description,
                            }));
                            return acc;
                        },
                        {} as Record<string, Array<{ url: string; description: string }>>
                    );



                    const prompt = userPrompt(
                        input,
                        initialWebResults,
                        deepParsedWebResults
                    );

                    const result = await streamText({
                        model: openai("gpt-4o"),
                        system: systemPrompt(),
                        messages: [{ role: "user", content: prompt }],
                    });

                    let accumulatedText = "";
                    for await (const textPart of result.textStream) {
                        accumulatedText += textPart;
                        searchText.update(accumulatedText);
                        yield (
                            <>
                            </>
                        );
                    }
                    searchText.done(accumulatedText);
                    history.done((messages: ServerMessage[]) => [
                        ...messages,
                        { role: "assistant", content: accumulatedText },
                    ]);
                    isComplete.done(true);
                    await saveConversationToThread(indexedPath, accumulatedText);
                    return (
                        <></>
                    )
                },
            },
        },
    });

    return {
        id: generateId(),
        role: "assistant",
        display: result.value,
        isComplete: isComplete.value,
        searchText: searchText.value,
        searchProgress: searchProgress.value,
    };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
    actions: {
        continueConversation,
    },
    initialAIState: [],
    initialUIState: [],
});
