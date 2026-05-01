import { QueryClient } from "@tanstack/react-query";

/**
 * React Query Client Configuration
 * Configures caching, retries, and other query behaviors
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Keep data in cache for 10 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

      // Retry failed requests 3 times with exponential backoff
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof Error && error.message.includes("4")) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },

      // Refetch on window focus (useful for mobile apps)
      refetchOnWindowFocus: true,

      // Refetch on reconnect
      refetchOnReconnect: true,

      // Network mode - always fetch when online
      networkMode: "online",
    },

    mutations: {
      // Retry mutations once on failure
      retry: 1,

      // Network mode for mutations
      networkMode: "online",
    },
  },
});
