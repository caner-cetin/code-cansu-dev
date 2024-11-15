'use client';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "@/contexts/AppContext";
import { type ReactNode, Suspense, useState } from "react";

export interface RootLayoutProps {
  children: ReactNode;
}
export const RootLayout: React.FC<RootLayoutProps> = (props) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      }),
  );
  return (
    <html lang="en">
      <AppProvider>
        <QueryClientProvider client={queryClient}>
          <body>
            <Suspense fallback={<div>Loading...</div>}>
              {props.children}
            </Suspense>
          </body>
        </QueryClientProvider>
      </AppProvider>
    </html>
  );
};
