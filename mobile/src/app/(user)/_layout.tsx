import { useAuth } from "@/providers/AuthProvider";
import { Redirect, Slot } from "expo-router";

export default function ProtectedLayout() {
  const { user, isLoading } = useAuth();

  // Prevents screen flickering while determining authentication state
  if (isLoading) {
    return;
  }

  // Redirect unauthenticated users immediately out of this group folder Tree
  if (!user) {
    return <Redirect href="/login" />;
  }

  // Render children screens transparently if everything passes
  return <Slot />;
}
