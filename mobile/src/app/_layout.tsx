import { useColorScheme } from "@/hooks/useColorScheme";
import { RootProvider } from "@/providers/RootProvider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "react-native-sonner";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack screenOptions={{ headerShown: false }}>
            {/* The sub-layouts */}
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(user)" />
          </Stack>

          <StatusBar style="auto" />
          <Toaster />
        </ThemeProvider>
      </RootProvider>
    </GestureHandlerRootView>
  );
}
