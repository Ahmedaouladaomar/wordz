import { useAuthStore } from "@/store/auth-store";
import { Heart, LogOut, Target, Trophy, User, X } from "@tamagui/lucide-icons";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Avatar,
  Button,
  Dialog,
  H4,
  Paragraph,
  Text,
  XStack,
  YStack,
} from "tamagui";

type MenuItem = "daily-goal" | "favourites" | "mastered";
interface Props {
  onSelectItem: (key: MenuItem) => any;
  onLogout: () => any;
  [key: string]: any;
}

export default function SideMenu({ onSelectItem, onLogout, ...styles }: Props) {
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const fullName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.email || "User";

  return (
    <YStack {...styles} h="100%" w="100%" pt={insets.top + 16}>
      <XStack jc="space-between" bbc="#7eb5be46" bbw={1}>
        <YStack f={1} pb="$4" pl="$5" ai="flex-start">
          <XStack ai="center" gap="$3.5" w="100%">
            <Avatar circular size="$5" backgroundColor="$brandPrimary">
              <Avatar.Image source={{ uri: user?.avatarUrl }} />
              <Avatar.Fallback jc="center" ai="center">
                <User size="$2" col="white" />
              </Avatar.Fallback>
            </Avatar>
            <YStack f={1}>
              <H4 size="$4" fow="600" numberOfLines={1}>
                {fullName}
              </H4>
              <XStack ai="center" gap={3}>
                <Paragraph size="$2" col="$colorMuted">
                  Level {user?.level?.rank || 1}
                </Paragraph>
                <Text col="$brandPrimary" fos={20}>
                  •
                </Text>
                <Paragraph col="$brandPrimary" tt="capitalize" fow="600">
                  {user?.level?.title}
                </Paragraph>
              </XStack>
            </YStack>
          </XStack>
        </YStack>
        <Dialog.Close asChild mr="$5">
          <Button icon={X} size={40} chromeless circular />
        </Dialog.Close>
      </XStack>

      {/* Navigation Menu Items */}
      <YStack gap="$2" mt="$4" f={1} px="$4">
        <Button
          size="$4"
          jc="flex-start"
          icon={Target}
          bc="$brandPrimaryLight"
          color="$brandPrimary"
          br="$3"
          fontWeight="600"
          onPress={() => onSelectItem("daily-goal")}
        >
          Daily Goal
        </Button>

        <Button
          size="$4"
          jc="flex-start"
          ai="center"
          icon={Heart}
          bc="$brandPrimaryLight"
          color="$brandPrimary"
          br="$3"
          fontWeight="600"
          onPress={() => onSelectItem("favourites")}
        >
          Favourites
        </Button>

        <Button
          size="$4"
          jc="flex-start"
          icon={Trophy}
          bc="$brandPrimaryLight"
          color="$brandPrimary"
          br="$3"
          fontWeight="600"
          onPress={() => onSelectItem("mastered")}
        >
          Mastered
        </Button>
      </YStack>

      <Button
        size="$4"
        icon={LogOut}
        ml="$4"
        color="red"
        fontWeight="600"
        onPress={() => onLogout()}
        mt="$4"
        als="flex-start"
      >
        Logout
      </Button>
    </YStack>
  );
}
