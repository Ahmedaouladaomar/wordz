import React from "react";
import { AuthProvider } from "./AuthProvider";
import { ReactQueryProvider } from "./ReactQueryProvider";

interface RootProviderProps {
  children: React.ReactNode;
}

export function RootProvider({ children }: RootProviderProps) {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        {/* Add more providers here as needed */}
        {children}
      </AuthProvider>
    </ReactQueryProvider>
  );
}
