import { ScreenLoader } from "@/components/screen-loader";
import { useColorScheme } from "@/hooks/useColorScheme";
import { RootProvider } from "@/providers/RootProvider";
import { useAuthStore } from "@/store/auth-store";
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
  const isLoading = useAuthStore((state) => state.isLoading);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          {isLoading ? (
            <ScreenLoader isVisible />
          ) : (
            <>
              <Stack screenOptions={{ headerShown: false }}>
                {/* The sub-layouts */}
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(user)" />
              </Stack>

              <StatusBar style="auto" />
              <Toaster />
            </>
          )}
        </ThemeProvider>
      </RootProvider>
    </GestureHandlerRootView>
  );
}
