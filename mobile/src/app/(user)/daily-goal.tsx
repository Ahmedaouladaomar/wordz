import { NumberInput } from "@/components/ui/number-input";
import { userService } from "@/services/userService";
import { useAuthStore } from "@/store/auth-store";
import {
  ArrowLeft,
  Coffee,
  FlaskConical,
  NotebookPen,
  TvMinimalPlay,
} from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "react-native-sonner";
import { Button, Text, XStack, YStack } from "tamagui";

interface Props {
  onBack: () => any;
  [key: string]: any;
}

export default function DailyGoalScreen({ onBack, styles }: Props) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  // Track the selected word goal target count state
  const [targetWords, setTargetWords] = useState<number>(
    user?.dailyTarget || 0,
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const presets = [
    { label: "Casual", count: 5, icon: <Coffee />, background: "#e558b625" },
    {
      label: "Regular",
      count: 10,
      icon: <TvMinimalPlay />,
      background: "#ff9a7b73",
    },
    {
      label: "Serious",
      count: 20,
      icon: <NotebookPen />,
      background: "#68c08253",
    },
    {
      label: "Expert",
      count: 30,
      icon: <FlaskConical />,
      background: "#8558e560",
    },
  ];

  const updateDailyTarget = async (dailyTarget: number) => {
    try {
      const response = await userService.updateUser(user?.id as string, {
        dailyTarget,
      });
      if (response.success) {
        toast.success(response.message);
      }
      setTargetWords(response.data?.dailyTarget || 0);
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleSaveGoal = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateDailyTarget(targetWords).finally(() => setIsSaving(false));
    }, 500);
  };

  return (
    <YStack f={1} bc="$brandPrimaryLight" pt={insets.top} {...styles}>
      {/* Header Section */}
      <XStack
        bc="$background"
        bbw={1}
        boc="#7eb5be46"
        px="$5"
        pb="$3"
        mb="$2"
        ai="center"
        jc="space-between"
      >
        <XStack f={1}>
          <Button icon={ArrowLeft} size={45} onPress={onBack} />
        </XStack>
        <YStack f={1} ai="center">
          <XStack ai="center" gap="$3">
            <Text fos="$lg" fow="600" col="$brandPrimary">
              Daily Goal
            </Text>
          </XStack>
        </YStack>
        <XStack f={1}></XStack>
      </XStack>

      {/* Main Body Section */}
      <YStack f={1} pt={15} px="$5" pb={insets.bottom + 16}>
        <Text ml="$2" mb="$4" fow="500" col="gray" o={0.8}>
          Set up your daily words volume
        </Text>
        <YStack
          bc="white"
          px="$5"
          py="$5"
          br="$6"
          ai="center"
          gap="$4"
          boxShadow="0px 0px 2px lightgray"
        >
          <YStack px="$5" py="$2" ai="center" gap="$4">
            <Text fos={16} fow="500">
              Words per day
            </Text>
            <NumberInput
              value={targetWords}
              onChange={setTargetWords}
              showMinusIcon
              showPlusIcon
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                borderColor: "lightgray",
                borderWidth: 1,
              }}
            />
          </YStack>

          {/* Quick Option Picker */}
          <XStack jc="center" fw="wrap" gap={10}>
            {presets.map((preset) => {
              const isActive = targetWords === preset.count;
              return (
                <YStack
                  key={preset.label}
                  jc="flex-end"
                  py="$3"
                  px="$4"
                  gap={10}
                  h={120}
                  w="48%"
                  br={10}
                  bc={preset.background as any}
                  bw={1}
                  boc={isActive ? "#A0A0A0" : "transparent"}
                  onPress={() => setTargetWords(preset.count)}
                >
                  {preset.icon}
                  <YStack>
                    <Text fos={16} fow="700">
                      {preset.count} Words
                    </Text>
                    <Text fos={16} fow="500" col="gray">
                      {preset.label}
                    </Text>
                  </YStack>
                </YStack>
              );
            })}
          </XStack>
          {/* Action Save Button */}
          <Button
            bc="gray"
            pressStyle={{ o: 0.8 }}
            h={50}
            w="100%"
            onPress={handleSaveGoal}
            disabled={isSaving}
          >
            <XStack ai="center" gap="$2">
              <Text col="$background" fow="600" fos={16}>
                {isSaving ? "Saving..." : "Confirm Goal"}
              </Text>
            </XStack>
          </Button>
        </YStack>
      </YStack>
    </YStack>
  );
}
