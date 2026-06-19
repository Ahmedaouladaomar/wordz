import { useAuth } from "@/providers/AuthProvider";
import { Redirect, Stack } from "expo-router"; // 👈 Swap Slot for Stack here

export default function UserLayout() {
  const { user, isLoading } = useAuth();

  // Prevents screen flickering while determining authentication state
  if (isLoading) {
    return null; // Returning null explicitly is safer to prevent blank element errors
  }

  // Redirect unauthenticated users immediately out of this group folder Tree
  if (!user) {
    return <Redirect href="/login" />;
  }

  // Render children screens inside an animated Stack navigator instead of a static Slot
  return (
    <Stack>
      {/* 1. Your bottom tabs system remains the root dashboard view */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      {/* 2. Your favorites screen slides elegantly over the tabs from the right */}
      <Stack.Screen
        name="favourites"
        options={{
          headerShown: false,
          animation: "slide_from_right", // 👈 This forces the native Instagram-style transition!
        }}
      />

      {/* 3. Your daily goal screen also behaves as a smooth sub-page overlay */}
      <Stack.Screen
        name="daily-goal"
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
