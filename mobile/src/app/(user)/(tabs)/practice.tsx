import { CircleSpinner } from "@/components/ui/circle-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeletePractice,
  useUpdatePracticeTotalWords,
} from "@/hooks/practice-hooks";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFlipAnimation } from "@/hooks/useFlipAnimation";
import { useUnmasteredTerms } from "@/hooks/vocabulary-hooks";
import { practiceService } from "@/services/practiceService";
import { useAuthStore } from "@/store/auth-store";
import { Practice } from "@/types/practice";
import { Vocabulary } from "@/types/vocabulary";
import { BookOpen, PartyPopper, RotateCcw } from "@tamagui/lucide-icons";
import { FlipHorizontal2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Animated, StyleSheet } from "react-native";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import { toast } from "react-native-sonner";
import { Button, Separator, Text, View, XStack, YStack } from "tamagui";

export default function PracticeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const user = useAuthStore((state) => state.user);

  const [practice, setPractice] = useState<Practice | undefined>(undefined);

  const { flipToFrontStyle, flipToBackStyle, flipCard, resetCard } =
    useFlipAnimation();

  const { mutate: updateTotalWords, isPending: isLoadingGotIt } =
    useUpdatePracticeTotalWords();

  const { mutate: deletePractice, isPending: isLoadingStillLearning } =
    useDeletePractice();

  const {
    data,
    refetch,
    isFetching: isFetchingTerms,
  } = useUnmasteredTerms({ page: 1, take: 10 });
  const words: Vocabulary[] = data?.data?.items || [];

  const currentWord = words?.[0];

  const getPractice = async () => {
    const res = await practiceService.todayPractice();
    if (res.success) {
      setPractice(res.data);
    }
  };

  useEffect(() => {
    getPractice();
  }, []);

  const handleGotIt = () => {
    try {
      const totalWords = (practice?.totalWords || 0) + 1;
      updateTotalWords(
        {
          id: practice!.id,
          payload: {
            totalWords,
            vocabularyId: currentWord.id,
          },
        },
        {
          onSuccess: async () => {
            const isCompleted = totalWords === user?.dailyTarget;
            // update local state immediately for better UX
            setPractice((prev) =>
              prev ? { ...prev, totalWords, isCompleted } : undefined,
            );
          },
        },
      );
    } catch (e) {
      toast.error(JSON.stringify(e));
    }
  };

  const handleStillLearning = () => {
    try {
      if (practice?.id) {
        deletePractice(practice?.id, {
          onSuccess: async () => {
            // Refetch practice session
            await getPractice();
            // refetch new batch of unmastered terms
            await refetch();
            resetCard();
          },
        });
      }
    } catch (e) {
      toast.error(JSON.stringify(e));
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Section */}
        <View style={[styles.progressCard]}>
          <Text col="$brandPrimary" fos="$sm" fow="600" mb={5}>
            DAILY PRACTICE
          </Text>
          <XStack style={styles.progressContent} jc="space-between" ai="center">
            <Text style={[styles.progressValue]} col="#003439">
              {practice?.totalWords || 0} / {user?.dailyTarget} Words
            </Text>
            <Text col="$brandPrimary" fos="$md" fow="600">
              {Math.floor(
                ((practice?.totalWords || 0) / (user?.dailyTarget || 1)) * 100,
              )}
              %
            </Text>
          </XStack>
          <View style={[styles.progressBar]} bc="rgba(126, 181, 190, 0.37)">
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.floor(
                    ((practice?.totalWords || 0) / (user?.dailyTarget || 1)) *
                      100,
                  )}%`,
                },
              ]}
              bc="$brandPrimary"
            />
          </View>
        </View>

        {practice?.isCompleted ? (
          <ScrollView
            contentContainerStyle={{
              flex: 1,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.emptyState,
                {
                  backgroundColor: isDark ? "#1a1a1a" : "white",
                },
              ]}
            >
              <XStack ai="center" gap={10} mb={15}>
                <PartyPopper size={40} />
                <Text fos="$xl" fow={700}>
                  All Set!
                </Text>
              </XStack>
              <Text fow="500" fos="$md" ta="center" w="70%" col="gray">
                You&apos;ve mastered all your words for today. Keep up the great
                work!
              </Text>
            </View>
            <Button bc="#abf3fd" mt={30} br="$10" onPress={handleStillLearning}>
              {isLoadingStillLearning ? (
                <CircleSpinner color="#006572" />
              ) : (
                <>
                  <RotateCcw col="red" size={20} mr={10} />
                  <Text col="$brandPrimary" fos="$md" fow="600">
                    Still learning
                  </Text>
                </>
              )}
            </Button>
          </ScrollView>
        ) : isFetchingTerms ? (
          <YStack gap={30}>
            <Skeleton.Pulse>
              <Skeleton w="100%" h={350} br={40} />
            </Skeleton.Pulse>
            <Skeleton.Pulse>
              <Skeleton w="100%" h={50} br={40} />
            </Skeleton.Pulse>
          </YStack>
        ) : words.length > 0 ? (
          <>
            <Pressable style={styles.cardContainer} onPress={flipCard}>
              {/* Flipable Card */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 350,
                }}
              >
                {/* Front of card */}
                <Animated.View style={[flipToFrontStyle, styles.card]}>
                  <View
                    bc={isDark ? "#1a1a1a" : "#97EAF4"}
                    style={styles.cardContent}
                  >
                    <Text
                      col="#D8F8FF"
                      bc="#006572"
                      br="$10"
                      px={20}
                      py={5}
                      mb={10}
                      fow="700"
                    >
                      TERM
                    </Text>
                    <Text
                      ta="center"
                      col="#003439"
                      mt={10}
                      mb={20}
                      br="$10"
                      fow="700"
                      fos="$lg"
                    >
                      {currentWord?.term}
                    </Text>

                    <XStack ai="center" gap={10}>
                      <FlipHorizontal2 color="#005261a1" />
                      <Text col="#005261a1">TAP TO FLIP</Text>
                    </XStack>
                  </View>
                </Animated.View>

                {/* Back of card */}
                <Animated.View style={[flipToBackStyle, styles.card]}>
                  <View
                    bc={isDark ? "#1a1a1a" : "#97EAF4"}
                    style={styles.cardContent}
                  >
                    <Text
                      col="#D8F8FF"
                      bc="#006572"
                      br="$10"
                      px={20}
                      py={5}
                      mb={10}
                      fow="700"
                    >
                      DEFINITION
                    </Text>
                    <Text
                      ta="center"
                      col="#003439"
                      mt={10}
                      mb={20}
                      br="$10"
                      fow="700"
                      fos="$lg"
                    >
                      {currentWord?.definition}
                    </Text>
                    <Separator
                      style={{ borderColor: "#0065721e" }}
                      w="100%"
                      my={10}
                    />

                    <Text mt={20} mb={40} col="#29646A">
                      {currentWord?.example}
                    </Text>

                    <XStack ai="center" gap={10}>
                      <FlipHorizontal2 color="#005261a1" />
                      <Text col="#005261a1">TAP TO FLIP BACK</Text>
                    </XStack>
                  </View>
                </Animated.View>
              </View>
            </Pressable>
            <Button
              bc={isLoadingGotIt ? "#006572a7" : "$brandPrimary"}
              br="$10"
              onPress={handleGotIt}
            >
              {isLoadingGotIt ? (
                <CircleSpinner color="white" />
              ) : (
                <Text col="white" fos="$md" fow="600">
                  Got it!
                </Text>
              )}
            </Button>
          </>
        ) : (
          <View
            style={[
              styles.emptyState,
              {
                backgroundColor: isDark ? "#1a1a1a" : "white",
              },
            ]}
          >
            <YStack px={10} ai="center" jc="center" mb={15} gap={10}>
              <BookOpen size={40} />
              <Text ta="center" fos="$xl" fow={700} w="auto" fs={1}>
                No more words to practice
              </Text>
            </YStack>
            <Text ta="center" fow="500" fos="$md" w="70%" col="gray">
              Add more words to continue practicing
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    height: "100%",
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  progressCard: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  progressContent: {
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  progressValue: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  progressSubtext: {
    fontSize: 13,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  streakBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 24,
    alignItems: "center",
  },
  streakBadgeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  cardContainer: {
    marginBottom: 30,
    perspective: "1000",
  },
  card: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  cardContent: {
    flex: 1,
    borderRadius: 40,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  cardTerm: {
    fontSize: 36,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  cardDefinition: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 8,
  },
  emptyState: {
    borderRadius: 40,
    borderColor: "whitesmoke",
    alignItems: "center",
    justifyContent: "center",
    height: 350,
    borderWidth: 1,
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
