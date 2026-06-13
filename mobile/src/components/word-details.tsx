import { ThemedText } from "@/components/themed-text";
import { vocabularyService } from "@/services/vocabularyService";
import { Vocabulary } from "@/types/vocabulary";
import { Heart, Volume2, X } from "@tamagui/lucide-icons";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "react-native-sonner";
import { Text, useTheme, XStack, YStack } from "tamagui";

interface WordDetailsModalProps {
  visible: boolean;
  word: Vocabulary;
  onClose: () => void;
  onPlaySound?: () => void;
}

export function WordDetails({
  visible,
  word,
  onClose,
  onPlaySound,
}: WordDetailsModalProps) {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === "dark";
  const brandPrimary = theme.brandPrimary?.get();

  const [vocabulary, setVocabulary] = useState<Vocabulary>(word);

  const toggleFavourite = async () => {
    const oldIsFavourite = vocabulary.isFavourite;
    const response = await vocabularyService.updateVocabulary(vocabulary.id, {
      isFavourite: !oldIsFavourite,
    });
    if (response.success) {
      setVocabulary((prev) => ({ ...prev, isFavourite: !oldIsFavourite }));
    }
    try {
    } catch {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    setVocabulary(word);
  }, [word]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable style={[styles.backdrop]} onPress={onClose} />

      {/* Modal Content */}
      <YStack
        bc="$brandPrimaryLight"
        style={[
          styles.container,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        {/* Header */}
        <XStack style={styles.header}>
          <XStack f={1} />
          <Text
            fos="$lg"
            fow={600}
            col="$brandPrimary"
            f={2}
            style={{ textAlign: "center" }}
          >
            Word Details
          </Text>
          <XStack f={1} jc="flex-end">
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} col={brandPrimary} />
            </TouchableOpacity>
          </XStack>
        </XStack>

        {/* Scrollable Content */}
        <YStack style={styles.content}>
          {/* Term and Pronunciation */}
          <YStack style={styles.section}>
            <XStack style={styles.termContainer} jc="space-between" ai="center">
              <XStack ai="center" gap={10}>
                <ThemedText style={[styles.term, { color: brandPrimary }]}>
                  {vocabulary.term}
                </ThemedText>
                <TouchableOpacity onPress={toggleFavourite}>
                  <Heart
                    size={22}
                    col="$brandPrimary"
                    fill={vocabulary.isFavourite ? brandPrimary : "transparent"}
                  />
                </TouchableOpacity>
              </XStack>

              <TouchableOpacity
                onPress={onPlaySound}
                style={[
                  styles.soundButton,
                  {
                    backgroundColor: brandPrimary,
                  },
                ]}
              >
                <Volume2 size={20} col="white" />
              </TouchableOpacity>
            </XStack>
            <ThemedText
              style={[
                styles.sectionLabel,
                {
                  color: isDark ? "#888" : "#666",
                },
              ]}
            >
              Term
            </ThemedText>
          </YStack>

          {/* Definition */}
          <YStack style={styles.section}>
            <ThemedText
              style={[
                styles.sectionLabel,
                {
                  color: isDark ? "#888" : "#666",
                  marginBottom: 12,
                },
              ]}
            >
              Definition
            </ThemedText>
            <ThemedText
              style={[
                styles.definitionText,
                {
                  color: isDark ? "#e0e0e0" : "#333",
                },
              ]}
            >
              {vocabulary.definition}
            </ThemedText>
          </YStack>

          {/* Example of Usage */}
          <YStack style={styles.section}>
            <ThemedText
              style={[
                styles.sectionLabel,
                {
                  color: isDark ? "#888" : "#666",
                  marginBottom: 12,
                },
              ]}
            >
              Example of Usage
            </ThemedText>
            <ThemedText
              style={[
                styles.exampleText,
                {
                  color: isDark ? "#e0e0e0" : "#333",
                  fontStyle: "italic",
                },
              ]}
            >
              {vocabulary.example}
            </ThemedText>
          </YStack>
        </YStack>

        {/* Close Button */}
        <XStack style={styles.footer}>
          <TouchableOpacity
            onPress={onClose}
            style={[
              styles.closeFullButton,
              {
                backgroundColor: brandPrimary,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.closeButtonText,
                {
                  color: "white",
                },
              ]}
            >
              Close
            </ThemedText>
          </TouchableOpacity>
        </XStack>
      </YStack>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
    maxHeight: "75%",
  },
  section: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  termContainer: {
    marginBottom: 8,
  },
  term: {
    fontSize: 24,
    fontWeight: "700",
  },
  soundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  definitionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  exampleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  closeFullButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
