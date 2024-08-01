
# Hello Perplexity!
This is my perplexity clone. Thanks for giving me the chance to make it.

https://github.com/user-attachments/assets/5ae2660a-0e53-439c-accd-bf957d6fa011

#### Preface
I do not write a lot of react in a production context, so I learned a lot combing through the docs and using features I have not used before. If given the chance, I'd love to know whhere I can improve, or where I missed the mark.

## Overview
- NextJS for SSR and Routing

- Most of the state is managed in a context called `FrontendProvider`
- I use `redis` to store thread (conversation) state.
- Searching is done with Brave's API.
- `shadcn/ui` and the `vercel-ai-sdk` are used to build the UI and the AI functionality

### Search Flow

The main search interface is implemented in the `SearchPage` component.

When a user submits a query, it triggers the `handleQuery` function in the `FrontendProvider` context.

`handleQuery` saves the frontend-context to redis, creates a hash similar to perplexity's, and pushes the router to a pending URL. 

After the LLM is done generating it's response, we save the conversation at the end into redis where the `thread-id` is.

Notably, I did not implement the abortion of a pending thread (which is what I observed from your application state); when a user leaves the page, the thread finishes on the server anyway. 

### Notes
- The Brave API has a hate-love relationship with me. I implemented some retry logic (ok I'll be honest, an LLM generated the retry logic), but there are still cases where I run into rate limiting issues and race conditions. If I worked on this longer, I'd spend more time making this more robust.

- There aren't fantastic results from the Web - I mainly gave the LLM the first few sentences of each webpage parsed. I'd want to spend more time prompt engineering/improving the actual LLM response.

- Most of the state management is handled in a simple context, but as we scale the application it can get quite hairy - tracking down bugs would get harder, and extending the application would be messy.

## Possible Improvements
- Make the Generative UI less... lackluster? It works, but I was quite inspired by the one in perplexity's (Pro Search) and I'd want to spend more time really making it pop.
- Make the LLM stream fade-in effectively. I had trouble with syncing the client/server state properly and if I read more of the implementation details of the vercel ai sdk, I think I'd eventually figure it out. The main issue the React Markdown component constantly rerendering
- Authentication
- Change the model / LLM
- Code Syntax Highlighting
- Adding Mobile Support
- Give the LLM more tools
- Add Video Search
- Learn more about how state management is done in a production context


Thanks again!
