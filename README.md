# Hello Perplexity!

This is my perplexity clone. Here's how it works:


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

### Tradeoffs
- Most of the state management is handled in a simple context, but as we scale the application it can get quite hairy - tracking down bugs would get harder, not easier. 






