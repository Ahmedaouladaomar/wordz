import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/providers/AuthProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Book,
  CirclePlus,
  CircleUser,
  FileQuestion,
} from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import { useEffect } from "react";
import { Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, XStack } from "tamagui";

export default function AppLayout() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === "dark";

  const tabsList = [
    {
      name: "words",
      href: "/(user)/words",
      label: "Words",
      icon: Book,
    },
    {
      name: "add",
      href: "/(user)/add",
      label: "Add",
      icon: CirclePlus,
    },
    {
      name: "practice",
      href: "/(user)/practice",
      label: "Practice",
      icon: FileQuestion,
    },
    {
      name: "profile",
      href: "/(user)/profile",
      label: "Profile",
      icon: CircleUser,
    },
  ];

  useEffect(() => {
    // If we're still loading the auth state, don't do anything yet
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
  };

  const LogoutButton = () => (
    <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
      <MaterialCommunityIcons
        name="logout"
        size={24}
        color={isDark ? "#fff" : "#000"}
      />
    </TouchableOpacity>
  );

  const TabItem = ({ isDark, Icon, label, isFocused, ...props }: any) => {
    return (
      <Pressable
        {...props}
        style={{
          backgroundColor: isFocused ? "#97EAF4" : "transparent",
          borderRadius: 50,
          paddingHorizontal: 30,
          height: 60,
          gap: 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon size={24} />
        <Text
          style={{
            fontSize: 10,
            color: isFocused ? "#000" : isDark ? "#666" : "#999",
          }}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <Tabs style={{ flex: 1, paddingTop: insets.top, backgroundColor: "white" }}>
      <XStack
        style={{
          paddingVertical: 10,
          justifyContent: "flex-end",
        }}
      >
        <LogoutButton />
      </XStack>
      <TabSlot />
      <TabList
        style={[
          styles.tabBar,
          {
            paddingBottom: insets.bottom,
          },
        ]}
      >
        {tabsList.map(({ name, href, label, icon }) => (
          <TabTrigger key={name} name={name} href={href as any} asChild>
            <TabItem isDark={isDark} Icon={icon} label={label} />
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "white",
    height: 120,
    paddingHorizontal: 20,
    paddingTop: 15,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    boxShadow: "0 0 20px 5px #F0F0F0",
  },
});
