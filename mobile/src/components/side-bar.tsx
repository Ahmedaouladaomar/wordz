import DailyGoalScreen from "@/app/(user)/daily-goal";
import FavouritesScreen from "@/app/(user)/favourites";
import MasteredScreen from "@/app/(user)/mastered";
import { useAuth } from "@/providers/AuthProvider";
import { Menu } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { AnimatePresence, Button, Dialog, YStack } from "tamagui";
import SideMenu from "./side-menu";

type MenuPane = "main" | "daily-goal" | "favourites" | "mastered";

export default function SideBar() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  const [currentPane, setCurrentPane] = useState<MenuPane>("main");

  const onBack = () => setCurrentPane("main");

  const isMain = currentPane === "main";

  const renderPane = () => {
    switch (currentPane) {
      case "daily-goal":
        return <DailyGoalScreen onBack={onBack} />;
      case "favourites":
        return <FavouritesScreen onBack={onBack} />;
      case "mastered":
        return <MasteredScreen onBack={onBack} />;
      case "main":
      default:
        return (
          <SideMenu
            pb="$5"
            onSelectItem={setCurrentPane}
            onLogout={() => {
              logout();
              setOpen(false);
            }}
          />
        );
    }
  };

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
        {/* The Side Bar Container */}
        <Dialog.Content
          key="content"
          animation="200ms"
          pos="absolute"
          l={0}
          t={0}
          b={0}
          w="100%"
          h="100%"
          br={0}
          py={0}
          px={0}
          dsp="flex"
          ai="center"
          overflowX="hidden"
          overflowY="hidden"
          elevation={0}
          shop={0.3}
          enterStyle={{ x: "-100%" }}
          exitStyle={{
            x: "-100%",
            elevation: 0,
            shop: 0,
          }}
        >
          <AnimatePresence>
            <YStack
              key={currentPane}
              pos="absolute"
              t={0}
              l={0}
              r={0}
              b={0}
              f={1}
              h="100%"
              animation="200ms"
              x={0}
              enterStyle={{ x: isMain ? -100 : 100, o: 0 }}
              exitStyle={{ x: isMain ? -100 : 100, o: 0 }}
            >
              {renderPane()}
            </YStack>
          </AnimatePresence>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
