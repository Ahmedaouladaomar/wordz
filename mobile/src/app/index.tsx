import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator } from "react-native";

import { ThemedView } from "@/components/themed-view";
import { useAuthStore } from "@/store/auth-store";

/**
 * Entry Point Screen
 * This screen handles the initial app navigation based on authentication status
 * It acts as a redirect and shows a loading state
 */
export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;
    router.replace(isAuthenticated ? "/home" : "/login");
  }, [isAuthenticated, isLoading, router]);

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ActivityIndicator size="large" />
    </ThemedView>
  );
}
