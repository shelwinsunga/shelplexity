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

export async function continueConversation(
    input: string,
    indexedPath: string,
): Promise<ClientMessage> {
    'use server';
    console.log('continueConversation', indexedPath);

    const history = getMutableAIState();
    history.update([]);
    const isComplete = createStreamableValue(false);



    const webResults = await searchWeb(input);
    const parsedWebResults = webResults.map(result => ({
        url: result.url,
        description: result.description
    }));


    const prompt = `
    Fetched Results:
    ${parsedWebResults.map(result => `- ${result.url}: ${result.description}`).join('\n')}
    User Query: ${input}
    `;

    const result = await streamUI({
        model: openai('gpt-4o-mini'),
        system: "You are an intelligent search engine assistant. Your primary role is to help users find information based on their queries. You will be provided with search results relevant to the user's input. Use these results to formulate comprehensive, accurate, and helpful responses. Format your answers in markdown, using the provided URLs and descriptions to create hyperlinks in your response. Use footnotes like [1] to reference the sources you used to answer the users question. Example: [1] (https://www.example.com/france-facts). Do not ever link without the [n] notation.",
        messages: (() => {
            const messages = [...history.get(), { role: 'user', content: prompt }];
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
            console.log('onSetAIState', state, done);
        }
    },
    initialAIState: [],
    initialUIState: [],
});