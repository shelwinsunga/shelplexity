'use server';

import { createAI, getMutableAIState, streamUI } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { ReactNode } from 'react';
import { z } from 'zod';
import { generateId } from 'ai';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { SearchTextRender } from '@/components/search/SearchTextRender';
import { createStreamableValue, StreamableValue } from 'ai/rsc';
import { searchWeb } from '@/actions/searchWeb';
import { kv } from '@vercel/kv';
import { getThreadData } from '@/actions/threadActions';

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

const WeatherForecast: React.FC<{ location: string; days: number }> = async ({ location, days }) => {
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Hardcoded weather data
    const weatherData = [
        { day: "Monday", temp: 72, condition: "Sunny" },
        { day: "Tuesday", temp: 68, condition: "Partly Cloudy" },
        { day: "Wednesday", temp: 75, condition: "Clear" },
        { day: "Thursday", temp: 70, condition: "Cloudy" },
        { day: "Friday", temp: 73, condition: "Sunny" },
    ];

    return (
        <div>
            <h2>Weather Forecast for {location}</h2>
            <ul>
                {weatherData.slice(0, days).map((day, index) => (
                    <li key={index}>
                        {day.day}: {day.temp}°F, {day.condition}
                    </li>
                ))}
            </ul>
        </div>
    );
};

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
    console.log('Input:', input);
    console.log('IndexedPath:', indexedPath);

    const history = getMutableAIState();
    history.update([]);
    console.log('History updated');

    const isComplete = createStreamableValue(false);
    console.log('isComplete streamable value created');

    let webResults;

    let retries = 0;
    const maxRetries = 3;
    const retryDelay = 500; 

    console.log('Starting retry loop for getThreadData');
    while (retries < maxRetries) {
        console.log(`Attempt ${retries + 1} to get thread data`);
        webResults = await getThreadData(indexedPath);
        if (webResults) {
            console.log('Thread data retrieved successfully');
            break;
        }
        
        retries++;
        if (retries < maxRetries) {
            console.log(`Retry attempt ${retries}. Waiting for ${retryDelay}ms`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }

    console.log('Web results:', webResults);
    const parsedWebResults = Array.isArray(webResults?.sourceResults) 
        ? (typeof webResults.sourceResults === 'string' 
            ? JSON.parse(webResults.sourceResults)
            : webResults.sourceResults
          ).map((result: any, index: number) => ({
            url: result.url,
            description: result.description,
            index: index + 1
          }))
        : [];

    console.log('Parsed web results:', parsedWebResults);


    const result = await streamUI({
        model: openai('gpt-4o'),
        system: systemPrompt(input, parsedWebResults),
        messages: (() => {
            const messages = [...history.get(), { role: 'user', content: input }];
            // debug
            // console.log('Messages:', JSON.stringify(messages, null, 2));
            return messages;
        })(),
        text: ({ content, done }) => {
            if (done) {
                history.done((messages: ServerMessage[]) => [
                    ...messages,
                    { role: 'assistant', content },
                ]);
                isComplete.done(true);
            }
            return <SearchTextRender>
                {content}
            </SearchTextRender>;
        },
        tools: {
            getWeatherForecast: {
                description:
                    'Get weather forecast for a location for the specified number of days',
                parameters: z.object({
                    location: z
                        .string()
                        .describe('The location to get weather forecast for'),
                    days: z
                        .number()
                        .describe('The number of days to get forecast for'),

                }),
                generate: async ({ location, days }) => {
                    history.done((messages: ServerMessage[]) => [
                        ...messages,
                        {
                            role: 'assistant',
                            content: `Showing weather forecast for ${location}`,
                        },
                    ]);
                    return <WeatherForecast location={location} days={days} />;
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
    onSetAIState: async ({ state, done }) => {
        'use server';
        if (done) {
            // console.log('onSetAIState', state, done);
        }
    },
    initialAIState: [],
    initialUIState: [],
});