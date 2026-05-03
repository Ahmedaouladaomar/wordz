import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/providers/AuthProvider";
import { RootProvider } from "@/providers/RootProvider";
import { useEffect } from "react";

export const unstable_settings = {
  initialRouteName: "index",
};

/**
 * Gatekeeper, acts as a safety guard
 */
export function AppLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (isLoading) return;

    // Check if the user is on an auth screen (login, register etc...)
    const inAuthGroup = ["login", "register", "index", "verify-email"].includes(
      segments[0],
    );

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to landing/login if not authenticated
      router.replace("/");
    } else if (isAuthenticated && inAuthGroup) {
      // AUTO-LOGIN: Redirect to home if authenticated but trying to access auth screens
      router.replace("/home");
    }
  }, [isAuthenticated, user]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Entry Point */}
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />

        {/* Public Routes - Accessible without authentication */}
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerShown: false,
          }}
        />

        {/* Protected Routes - Require authentication */}
        <Stack.Screen
          name="home"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="dashboard"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

/**
 * RootLayout is the entry point that wraps everything in necessary providers.
 */
export default function RootLayout() {
  return (
    <RootProvider>
      <AppLayout />
    </RootProvider>
  );
}
