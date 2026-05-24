import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

interface Word {
  id: string;
  title: string;
  description: string;
  addedAt: Date;
}

export default function WordsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [words, setWords] = useState<Word[]>([
    {
      id: "1",
      title: "Ephemeral",
      description: "Lasting for a very short time",
      addedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "2",
      title: "Serendipity",
      description:
        "The occurrence of events by chance in a happy or beneficial way",
      addedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: "3",
      title: "Mellifluous",
      description: "Sweet or musical; pleasant to hear",
      addedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ]);

  const filteredWords = words.filter(
    (word) =>
      word.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  const iconColor = isDark ? Colors.dark.icon : Colors.light.icon;
  const brandPrimary = "#006572";
  const brandPrimaryLight = "#E1FBFF";

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <ThemedView
          style={[
            styles.searchContainer,
            {
              backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5",
            },
          ]}
        >
          <TextInput
            style={[
              styles.searchInput,
              {
                color: textColor,
              },
            ]}
            placeholder="Search words..."
            placeholderTextColor={iconColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </ThemedView>

        {/* Streak Card */}
        <ThemedView
          style={[
            styles.streakCard,
            {
              backgroundColor: brandPrimary,
            },
          ]}
        >
          <ThemedText
            style={[
              styles.streakLabel,
              {
                color: "#fff",
              },
            ]}
          >
            🔥 Current Streak
          </ThemedText>
          <ThemedText
            style={[
              styles.streakValue,
              {
                color: "#fff",
              },
            ]}
          >
            7 Days
          </ThemedText>
          <ThemedText
            style={[
              styles.streakSubtext,
              {
                color: "rgba(255, 255, 255, 0.8)",
              },
            ]}
          >
            Keep it up! Add more words to maintain your streak.
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
          Recently Added Words
        </ThemedText>

        {/* Words List */}
        {filteredWords.length > 0 ? (
          <ThemedView style={styles.wordsList}>
            {filteredWords.map((word) => (
              <ThemedView
                key={word.id}
                style={[
                  styles.wordCard,
                  {
                    backgroundColor: isDark ? "#1a1a1a" : "#f9f9f9",
                    borderColor: brandPrimaryLight,
                  },
                ]}
              >
                <ThemedView style={styles.wordHeader}>
                  <ThemedText
                    style={[
                      styles.wordTitle,
                      {
                        color: brandPrimary,
                      },
                    ]}
                  >
                    {word.title}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.wordTime,
                      {
                        color: iconColor,
                      },
                    ]}
                  >
                    {formatTimeAgo(word.addedAt)}
                  </ThemedText>
                </ThemedView>
                <ThemedText
                  style={[
                    styles.wordDescription,
                    {
                      color: isDark ? "#ccc" : "#666",
                    },
                  ]}
                >
                  {word.description}
                </ThemedText>
              </ThemedView>
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
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: brandPrimary,
          },
        ]}
        onPress={() => {
          // Navigate to add word screen
          console.log("Add new word");
        }}
      >
        <ThemedText style={styles.fabIcon}>+</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  searchContainer: {
    marginBottom: 20,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    justifyContent: "center",
  },
  searchInput: {
    fontSize: 16,
    height: 44,
  },
  streakCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
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
    marginBottom: 12,
  },
  wordsList: {
    marginBottom: 20,
    gap: 12,
  },
  wordCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  wordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  wordTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  wordTime: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 8,
  },
  wordDescription: {
    fontSize: 14,
    lineHeight: 20,
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
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
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
