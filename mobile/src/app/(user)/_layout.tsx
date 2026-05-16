import { useAuth } from "@/providers/AuthProvider";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If we're still loading the auth state, don't do anything yet
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
