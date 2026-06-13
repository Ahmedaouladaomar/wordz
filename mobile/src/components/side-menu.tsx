import { useAuth } from "@/providers/AuthProvider";
import {
  Heart,
  LogOut,
  Menu,
  Target,
  Trophy,
  User,
  X,
} from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

export default function SideMenu() {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const router = useRouter();

  const fullName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.email || "User";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button bc="transparent" size="$6" icon={Menu} circular />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          onPress={() => setOpen(false)}
          enterStyle={{ o: 0 }}
          exitStyle={{ o: 0 }}
        />
        {/* The Side Sheet Container */}
        <Dialog.Content
          key="content"
          animation="200ms"
          pos="absolute"
          l={0}
          t={0}
          b={0}
          w={"100%"}
          h="100%"
          br={0}
          px={0}
          py="$5"
          x={0}
          elevation={0}
          shop={0.3}
          enterStyle={{ x: "-100%" }}
          exitStyle={{
            x: "-100%",
            elevation: 0,
            shop: 0,
          }}
          bc="$background"
        >
          <XStack
            jc="space-between"
            mb="$2"
            pt={insets.top}
            bbc="#7eb5be46"
            bbw={1}
          >
            <YStack f={1} pb="$4" pl="$5" ai="flex-start">
              <XStack ai="center" gap="$3.5" w="100%">
                <Avatar circular size="$5" backgroundColor="$brandPrimary">
                  <Avatar.Image source={{ uri: user?.avatarUrl }} />
                  <Avatar.Fallback jc="center" ai="center">
                    <User size={25} col="white" />
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
          <YStack gap="$2" mt="$4" f={1} pl="$4">
            <Button
              size="$4"
              jc="flex-start"
              icon={Target}
              bc="$brandPrimaryLight"
              color="$brandPrimary"
              br="$3"
              fontWeight="600"
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
              onPress={() => {
                router.push("/(user)/favourites");
              }}
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
            onPress={() => {
              logout();
              setOpen(false);
            }}
            mt="$4"
            als="flex-start"
          >
            Logout
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
