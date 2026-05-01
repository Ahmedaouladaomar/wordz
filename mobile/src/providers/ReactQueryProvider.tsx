import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import { queryClient } from "@/api/queryClient";

type Props = {
  children: any;
};

/**
 * React Query Provider Component
 * Wraps the app with React Query's QueryClientProvider
 */
export function ReactQueryProvider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
