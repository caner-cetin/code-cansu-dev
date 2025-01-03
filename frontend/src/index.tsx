import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { EditorProvider } from './stores/EditorStore';
import NotFound from '@/components/NotFound';
// Create a new router instance
const router = createRouter({ routeTree, defaultNotFoundComponent: NotFound })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});
const rootElement = document.getElementById('root')
// eslint please shut up
if (!rootElement) {
  throw new Error('No root element found')
}
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <EditorProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </EditorProvider>
  )
}