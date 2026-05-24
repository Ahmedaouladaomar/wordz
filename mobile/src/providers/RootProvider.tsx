import { useColorScheme } from "@/hooks/useColorScheme";
import "@tamagui/native/setup-teleport";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalProvider, TamaguiProvider } from "tamagui";
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
          <PortalProvider shouldAddRootHost>
            <AuthProvider>
              {/* Add more providers here as needed */}
              {children}
            </AuthProvider>
          </PortalProvider>
        </TamaguiProvider>
      </ReactQueryProvider>
    </GestureHandlerRootView>
  );
}
