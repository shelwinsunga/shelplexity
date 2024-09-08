
https://github.com/user-attachments/assets/5ae2660a-0e53-439c-accd-bf957d6fa011

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

### Notes

- The Brave API has a hate-love relationship with me. I implemented some retry logic (ok I'll be honest, an LLM generated the retry logic), but there are still cases where I run into rate limiting issues and race conditions. If I worked on this longer, I'd spend more time making this more robust.

- There aren't fantastic results from the Web - I mainly gave the LLM the first few sentences of each webpage parsed. I'd want to spend more time prompt engineering/improving the actual LLM response. Maybe using something like `@mozilla/readability` or a similar tool to extract web contents. Reading from files/pdfs would be nice.

## Possible Improvements
- Authentication
- Change the model / LLM
- Code Syntax Highlighting
- Adding Mobile Support
- Give the LLM more tools
- Add Video Search
- Fix the typescript types - not very precise yet.
