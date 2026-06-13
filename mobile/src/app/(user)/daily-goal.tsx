import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { practiceService } from "@/services/practiceService";
import { ArrowRight } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    useColorScheme,
} from "react-native";
import { Button, Progress, Text, useTheme, View, XStack, YStack } from "tamagui";

export default function DailyGoalScreen() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const router = useRouter();
  const isDark = colorScheme === "dark";

  const [goal, setGoal] = useState<{
    goal: number;
    completed: number;
    remaining: number;
    practice?: any;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDailyGoal();
  }, []);

  const fetchDailyGoal = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await practiceService.getDailyGoalProgress();
      if (response.success && response.data) {
        setGoal(response.data);
      } else {
        setError(response.message || "Failed to fetch daily goal");
      }
    } catch (err) {
      setError("An error occurred while fetching daily goal");
    } finally {
      setIsLoading(false);
    }
  };

  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  const progressPercentage = goal
    ? Math.round((goal.completed / goal.goal) * 100)
    : 0;

  const handleStartPractice = () => {
    router.push("/(user)/(tabs)/practice");
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.header} col={textColor}>
          Daily Goal
        </Text>

        {isLoading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={theme.brandPrimary?.get()} />
          </View>
        ) : error ? (
          <View style={styles.centerContent}>
            <Text col="red">{error}</Text>
            <Button
              onPress={fetchDailyGoal}
              mt="$4"
              size="$3"
              bg="$brandPrimary"
              color="white"
            >
              Retry
            </Button>
          </View>
        ) : goal ? (
          <YStack gap="$6">
            {/* Goal Progress Card */}
            <View
              style={[
                styles.goalCard,
                {
                  backgroundColor: isDark ? "#1a1a1a" : "white",
                  borderColor: isDark ? "#333" : "#f0f0f0",
                },
              ]}
            >
              <YStack gap="$3">
                <XStack jc="space-between" ai="center">
                  <YStack>
                    <Text size="$2" col="$colorMuted">
                      Today's Goal
                    </Text>
                    <Text size="$6" fow="700" col={textColor}>
                      {goal.completed} / {goal.goal}
                    </Text>
                  </YStack>
                  <View style={styles.progressCircle}>
                    <Text size="$5" fow="700" col="$brandPrimary">
                      {progressPercentage}%
                    </Text>
                  </View>
                </XStack>

                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                  <Progress
                    value={progressPercentage}
                    style={{ width: "100%", height: 12, borderRadius: 6 }}
                  />
                </View>

                {/* Status Message */}
                <Text size="$3" col={textColor} mt="$2">
                  {goal.remaining === 0
                    ? "🎉 Daily goal completed!"
                    : goal.remaining === 1
                      ? "1 more word to go!"
                      : `${goal.remaining} more words to complete your goal`}
                </Text>
              </YStack>
            </View>

            {/* Action Button */}
            {goal.remaining > 0 && (
              <Button
                onPress={handleStartPractice}
                size="$5"
                bg="$brandPrimary"
                color="white"
                fw="600"
                icon={ArrowRight}
              >
                Continue Practice
              </Button>
            )}

            {/* Current Practice Info */}
            {goal.practice && (
              <View
                style={[
                  styles.infoCard,
                  {
                    backgroundColor: isDark ? "#1a1a1a" : "white",
                    borderColor: isDark ? "#333" : "#f0f0f0",
                  },
                ]}
              >
                <Text size="$3" fow="600" col={textColor} mb="$2">
                  Current Session
                </Text>
                <YStack gap="$2">
                  <XStack jc="space-between">
                    <Text col="$colorMuted">Status:</Text>
                    <Text
                      col={
                        goal.practice.isCompleted ? "$brandPrimary" : "orange"
                      }
                      fow="600"
                    >
                      {goal.practice.isCompleted ? "Completed" : "In Progress"}
                    </Text>
                  </XStack>
                  <XStack jc="space-between">
                    <Text col="$colorMuted">Words Practiced:</Text>
                    <Text col={textColor} fow="600">
                      {goal.practice.totalWords}
                    </Text>
                  </XStack>
                </YStack>
              </View>
            )}
          </YStack>
        ) : null}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    height: 300,
  },
  goalCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8F4F8",
    justifyContent: "center",
    alignItems: "center",
  },
  progressBarContainer: {
    width: "100%",
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
});
