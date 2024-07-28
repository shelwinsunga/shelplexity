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
import { SearchResults } from '@/components/search/SearchResults';

export interface ServerMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ClientMessage {
    id: string;
    role: 'user' | 'assistant';
    display: ReactNode;
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
): Promise<ClientMessage> {
    'use server';

    const history = getMutableAIState();

    const result = await streamUI({
        model: openai('gpt-4o-mini'),
        messages: [...history.get(), { role: 'user', content: input }],
        text: ({ content, done }) => {
            if (done) {
                history.done((messages: ServerMessage[]) => [
                    ...messages,
                    { role: 'assistant', content },
                ]);
            }

            return <SearchResults>
                {content}
            </SearchResults>;
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
    };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
    actions: {
        continueConversation,
    },
    initialAIState: [],
    initialUIState: [],
});