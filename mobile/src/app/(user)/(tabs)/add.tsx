import { ThemedView } from "@/components/themed-view";
import { TextInput } from "@/components/ui/text-input";
import { vocabularyService } from "@/services/vocabularyService";
import { Plus } from "@tamagui/lucide-icons";
import { CheckCircle2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { toast } from "react-native-sonner";
import { Button, Text, XStack, YStack } from "tamagui";

export default function AddScreen() {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [example, setExample] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trendingWords, setTrendingWords] = useState<
    { id: string; word: string; count: number }[]
  >([]);

  // Fetch trending vocabularies
  useEffect(() => {
    const fetchTrendingWords = async () => {
      const response = await vocabularyService.getTrendingVocabularies();
      if (response.success && response.data) {
        setTrendingWords([]);
      }
    };
    fetchTrendingWords();
  }, []);

  const handleAddWord = async () => {
    if (!word.trim() || !definition.trim() || !example.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await vocabularyService.createvocabulary({
        term: word,
        definition: definition,
        example: example,
      });

      if (response.success) {
        setWord("");
        setDefinition("");
        setExample("");
        toast.success("Word added successfully!");
      } else {
        toast.error(response.message || "Failed to add word");
      }
    } catch {
      toast.error("An error occurred while adding the word");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <YStack style={styles.container} bc="$brandPrimaryLight">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <YStack style={styles.headerSection}>
          <Text style={styles.headerTitle} fos="$xl">
            Expand your<Text col="$brandPrimary"> vocabulary.</Text>
          </Text>
          <Text col="$brandPrimary" fos="$md">
            Capture a new word to keep your vocabulary growing. Every entry is a
            step toward mastery.
          </Text>
        </YStack>

        <ThemedView style={styles.inputSection}>
          <TextInput
            label="Word"
            placeholder="e.g. Ephemeral"
            value={word}
            onChangeText={setWord}
          />
        </ThemedView>

        <ThemedView style={styles.inputSection}>
          <TextInput
            label="Definition"
            placeholder="What does it mean?"
            value={definition}
            onChangeText={setDefinition}
            multiline
            numberOfLines={4}
          />
        </ThemedView>

        <ThemedView style={styles.inputSection}>
          <TextInput
            label="Example sentence"
            placeholder="Use in a sentence..."
            value={example}
            onChangeText={setExample}
            multiline
            numberOfLines={3}
          />
        </ThemedView>

        <Button
          style={styles.saveButton}
          h={55}
          br={30}
          bc="$brandPrimary"
          onPress={handleAddWord}
          disabled={isLoading}
          o={isLoading ? 0.5 : 1}
        >
          <CheckCircle2 size={20} color="white" />
          <Text style={styles.buttonText} fos="$lg">
            {isLoading ? "Saving..." : "Save word"}
          </Text>
        </Button>

        <YStack style={styles.trendingSection}>
          <Text style={styles.trendingTitle} col="$brandPrimary">
            Trending discoveries
          </Text>
          <XStack fw="wrap" gap={10}>
            {trendingWords.length > 0 ? (
              trendingWords.map((item) => (
                <XStack key={item.id} style={styles.trendingCard}>
                  <Plus col="$brandPrimary" />
                  <Text style={styles.trendingWord} col="$brandPrimary">
                    {item.word}
                  </Text>
                </XStack>
              ))
            ) : (
              <Text col="$brandPrimary" o={0.6}>
                No trending words yet
              </Text>
            )}
          </XStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 32,
  },
  headerTitle: {
    fontWeight: "700",
    marginBottom: 8,
  },
  inputSection: {
    marginBottom: 20,
    padding: 25,
    borderRadius: 30,
  },
  buttonSection: {
    marginBottom: 32,
    marginTop: 8,
  },
  saveButton: {
    fontWeight: 500,
    padding: 15,
    marginTop: 25,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  trendingSection: {
    marginTop: 40,
  },
  trendingTitle: {
    textTransform: "uppercase",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  trendingCard: {
    alignItems: "center",
    gap: 8,
    backgroundColor: "#A2EFF9",
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  trendingWord: {
    fontSize: 16,
    fontWeight: "600",
  },
});
