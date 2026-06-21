import { useAuth } from "@/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";
export default function UserLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="favourites"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="daily-goal"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
