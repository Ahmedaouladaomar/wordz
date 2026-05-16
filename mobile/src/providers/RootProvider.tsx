import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TamaguiProvider } from "tamagui";
import { tamaguiConfig } from "tamagui.config";
import { AuthProvider } from "./AuthProvider";
import { ReactQueryProvider } from "./ReactQueryProvider";

interface RootProviderProps {
  children: React.ReactNode;
}

export function RootProvider({ children }: RootProviderProps) {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReactQueryProvider>
        <TamaguiProvider
          config={tamaguiConfig}
          defaultTheme={colorScheme === "dark" ? "dark" : "light"}
        >
          <AuthProvider>
            {/* Add more providers here as needed */}
            {children}
          </AuthProvider>
        </TamaguiProvider>
      </ReactQueryProvider>
    </GestureHandlerRootView>
  );
}
