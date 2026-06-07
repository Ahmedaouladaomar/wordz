import { AddWord } from "@/components/add-word";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WordCard } from "@/components/word-card";
import { WordDetails } from "@/components/word-details";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/providers/AuthProvider";
import { vocabularyService } from "@/services/vocabularyService";
import { Vocabulary } from "@/types/vocabulary";
import { Plus, Search } from "@tamagui/lucide-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
} from "react-native";
import { toast } from "react-native-sonner";
import { Button, Text, useTheme, XStack } from "tamagui";

const DEFAULT_TAKE = 3;

export default function WordsScreen() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const { user } = useAuth();
  const isDark = colorScheme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [words, setWords] = useState<Vocabulary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<Vocabulary | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addWordModalVisible, setAddWordModalVisible] = useState(false);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await vocabularyService.getVocabularies({
          orderBy: "createdAt",
          sortOrder: "DESC",
          take: DEFAULT_TAKE,
        });
        if (response.success && response.data) {
          setWords(response.data.items);
        } else {
          setError(response.message || "Failed to fetch words");
        }
      } catch {
        setError("An error occurred while fetching words");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatest();
  }, []);

  const filteredWords = words?.filter(
    (word) =>
      word.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.definition.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  const iconColor = isDark ? Colors.dark.icon : Colors.light.icon;
  const brandPrimary = theme.brandPrimary?.get();
  const brandPrimaryLight = theme.brandPrimaryLight?.get();

  const handleWordPress = (word: Vocabulary) => {
    setSelectedWord(word);
    setModalVisible(true);
  };

  const handlePlaySound = () => {
    // TODO: Implement text-to-speech functionality
    console.log(`Playing pronunciation for: ${selectedWord?.term}`);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <XStack
          style={[
            styles.searchContainer,
            {
              backgroundColor: isDark ? "#1a1a1a" : "white",
            },
          ]}
        >
          <Search col="#29646A" />
          <TextInput
            style={[
              styles.searchInput,
              {
                color: textColor,
              },
            ]}
            placeholder="Search words..."
            placeholderTextColor="#7EB6BE"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </XStack>

        {/* Streak Card */}
        <ThemedView
          style={[
            styles.streakCard,
            {
              backgroundColor: "#97EAF4",
            },
          ]}
        >
          <ThemedText
            style={[
              styles.streakLabel,
              {
                color: brandPrimary,
              },
            ]}
          >
            🔥 Current Streak
          </ThemedText>
          <Text
            style={[
              styles.streakValue,
              {
                color: brandPrimary,
              },
            ]}
          >
            {user?.streak} Days
          </Text>
          <ThemedText
            style={[
              styles.streakSubtext,
              {
                color: brandPrimary,
              },
            ]}
          >
            Keep it up! Practice to maintain your streak.
          </ThemedText>
        </ThemedView>

        {/* Recently Added Words Header */}
        <ThemedText
          style={[
            styles.sectionTitle,
            {
              color: textColor,
            },
          ]}
        >
          Recently Added
        </ThemedText>

        {/* Words List */}
        {isLoading ? (
          <ThemedView
            style={[
              styles.emptyState,
              {
                backgroundColor: isDark ? "#1a1a1a" : brandPrimaryLight,
                borderColor: brandPrimary,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.emptyStateText,
                {
                  color: textColor,
                },
              ]}
            >
              Loading your words...
            </ThemedText>
          </ThemedView>
        ) : error ? (
          <ThemedView
            style={[
              styles.emptyState,
              {
                backgroundColor: isDark ? "#1a1a1a" : brandPrimaryLight,
                borderColor: "#ff6b6b",
              },
            ]}
          >
            <ThemedText
              style={[
                styles.emptyStateText,
                {
                  color: "#ff6b6b",
                },
              ]}
            >
              Error Loading Words
            </ThemedText>
            <ThemedText
              style={[
                styles.emptyStateSubtext,
                {
                  color: textColor,
                },
              ]}
            >
              {error}
            </ThemedText>
          </ThemedView>
        ) : filteredWords.length > 0 ? (
          <ThemedView style={styles.wordsList}>
            {filteredWords.map((word) => (
              <WordCard
                key={word.id}
                id={word.id}
                title={word.term}
                description={word.definition}
                addedAt={new Date(word.createdAt)}
                status="new"
                onPress={() => handleWordPress(word)}
                onPronounce={() => {
                  console.log(`Pronounce: ${word.term}`);
                }}
                onPractice={() => {
                  console.log(`Practice: ${word.term}`);
                }}
              />
            ))}
          </ThemedView>
        ) : (
          <ThemedView
            style={[
              styles.emptyState,
              {
                backgroundColor: isDark ? "#1a1a1a" : brandPrimaryLight,
                borderColor: brandPrimary,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.emptyStateText,
                {
                  color: textColor,
                },
              ]}
            >
              {searchQuery
                ? "No words match your search"
                : "No words added yet"}
            </ThemedText>
            <ThemedText
              style={[
                styles.emptyStateSubtext,
                {
                  color: iconColor,
                },
              ]}
            >
              {searchQuery
                ? "Try a different search term"
                : "Tap the + button to add your first word"}
            </ThemedText>
          </ThemedView>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <Button
        icon={<Plus size={25} col="white" />}
        br={30}
        style={[
          styles.fab,
          {
            backgroundColor: brandPrimary,
          },
        ]}
        onPress={() => {
          setAddWordModalVisible(true);
        }}
      />

      {/* Word Details Modal */}
      <WordDetails
        visible={modalVisible}
        word={selectedWord}
        onClose={() => setModalVisible(false)}
        onPlaySound={handlePlaySound}
      />

      {/* Add Word Modal */}
      <AddWord
        visible={addWordModalVisible}
        onClose={() => setAddWordModalVisible(false)}
        onSuccess={() => {
          toast.success("Word added successfully!");
          // Refresh the word list
          const fetchLatest = async () => {
            try {
              const response = await vocabularyService.getVocabularies({
                orderBy: "createdAt",
                sortOrder: "DESC",
                take: DEFAULT_TAKE,
              });
              if (response.success && response.data) {
                setWords(response.data.items);
              }
            } catch {
              console.error("Failed to refresh words");
            }
          };
          fetchLatest();
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  searchContainer: {
    marginBottom: 20,
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 44,
    gap: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  searchInput: {
    fontSize: 16,
    height: 44,
  },
  streakCard: {
    backgroundColor: "red",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  streakLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  streakValue: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  streakSubtext: {
    fontSize: 13,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 5,
    marginBottom: 12,
  },
  wordsList: {
    backgroundColor: "transparent",
    marginBottom: 20,
    gap: 12,
  },
  emptyState: {
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
    borderWidth: 1.5,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabIcon: {
    fontSize: 36,
    fontWeight: "300",
    color: "#fff",
  },
});
