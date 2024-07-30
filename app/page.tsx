import { SearchArea } from '@/components/search/SearchArea';
import { Snail } from 'lucide-react';
import { SearchTextRender } from '@/components/search/SearchTextRender';

export default function Page() {
  return (
    <>
      <div className="container mx-auto -mt-16 px-4 py-8 relative flex flex-col items-center justify-center h-screen">
        <div className="mb-8">
          <SearchTextRender>
            {`Welcome to Shelplexity, your intelligent search assistant!

Here's a sample of how our responses are formatted with footnotes:

Shelplexity uses advanced natural language processing techniques to provide accurate and helpful answers[1](https://www.example.com/nlp-techniques). Our system integrates various data sources to offer comprehensive results[2](https://www.example.com/data-integration).

Key features include:
- Real-time web search capabilities[3](https://www.example.com/real-time-search)
- Context-aware responses[4](https://www.example.com/context-awareness)
- Continuous learning and improvement[5](https://www.example.com/machine-learning)

Try asking a question to experience Shelplexity's capabilities!`}
          </SearchTextRender>
        </div>
        <div className="flex items-center mb-8">
          <Snail className="w-12 h-12 mr-4" />
          <h1 className="text-3xl font-semibold">Shelplexity</h1>
        </div>
        <div className="w-full max-w-2xl">
          <SearchArea />
        </div>
      </div>
    </>
  );
}
