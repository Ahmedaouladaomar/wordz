import { useAuth } from "@/providers/AuthProvider";
import {
  BookOpen,
  LogOut,
  Menu,
  Target,
  Trophy,
  X,
} from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Button, Dialog, H4, Paragraph, XStack, YStack } from "tamagui";

export default function SideMenu() {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const userName = user?.firstName
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
          opacity={0.5}
          onPress={() => setOpen(false)}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        {/* 3. The Side Sheet Container */}
        <Dialog.Content
          key="content"
          animation="200ms"
          position="absolute"
          left={0}
          top={0}
          bottom={0}
          width={"100%"}
          height="100%"
          borderRadius={0}
          padding="$5"
          x={0}
          elevation={0}
          shadowOpacity={0.3}
          enterStyle={{ x: "-100%" }}
          exitStyle={{
            x: "-100%",
            elevation: 0,
            shadowOpacity: 0,
          }}
          backgroundColor="$background"
        >
          <XStack jc="space-between" mb="$2" style={{ paddingTop: insets.top }}>
            <YStack f={1} pb="$4" bbc="$brandPrimary" bbw={1} ai="center">
              <XStack ai="center" gap="$3.5" w="100%">
                <Avatar circular size="$5" backgroundColor="$brandPrimary">
                  <Avatar.Image source={{ uri: user?.avatarUrl }} />
                  <Avatar.Fallback></Avatar.Fallback>
                </Avatar>
                <YStack flex={1}>
                  <H4 size="$4" fontWeight="600" numberOfLines={1}>
                    {userName}
                  </H4>
                  <Paragraph size="$2" color="$colorMuted">
                    Level {user?.level || 1}
                  </Paragraph>
                </YStack>
              </XStack>

              <Paragraph size="$3" color="$brandPrimary" fontWeight="600">
                {user?.totalWords || 0} Words Learned
              </Paragraph>
            </YStack>
            <Dialog.Close asChild>
              <Button icon={X} size="$4" chromeless circular />
            </Dialog.Close>
          </XStack>

          {/* Navigation Menu Items */}
          <YStack gap="$2" mt="$4" flex={1}>
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
              icon={BookOpen}
              backgroundColor="$brandPrimaryLight"
              color="$brandPrimary"
              borderRadius="$3"
              fontWeight="600"
            >
              Categories
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
            color="red"
            fontWeight="600"
            onPress={() => {
              logout();
              setOpen(false);
            }}
            mt="$4"
          >
            Logout
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
