import AppLogo from "@/components/icons/AppLogo";
import SideMenuDrawer from "@/components/side-menu-drawer";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  Book,
  CirclePlus,
  CircleUser,
  FileQuestion,
} from "@tamagui/lucide-icons";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import { Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, XStack, YStack } from "tamagui";

export default function AppLayout() {
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

  const TabItem = ({ isDark, Icon, label, isFocused, ...props }: any) => {
    return (
      <Pressable
        {...props}
        style={[
          styles.tabItem,
          {
            backgroundColor: isFocused ? "#97EAF4" : "transparent",
          },
        ]}
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
    <YStack f={1} bc="$brandPrimaryLight">
      <XStack style={[styles.topHeader, { paddingTop: insets.top }]}>
        {/* 1. Left Action Column */}
        <XStack style={styles.headerLeft}>
          <SideMenuDrawer />
        </XStack>

        <XStack style={styles.headerCenter}>
          <AppLogo width={35} height={30} />
        </XStack>

        <XStack style={styles.headerRight} />
      </XStack>
      <Tabs>
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
    </YStack>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1, // Takes up the middle room
    justifyContent: "center",
    alignItems: "center",
  },
  headerRight: {
    flex: 1, // Matches left column width to guarantee perfect center geometry
    justifyContent: "flex-end",
    alignItems: "center",
  },
  tabItem: {
    borderRadius: 50,
    paddingHorizontal: 30,
    height: 60,
    gap: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
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
