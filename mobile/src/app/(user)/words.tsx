import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/providers/AuthProvider";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function WordsScreen() {
  const { user } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText style={styles.subtitle}>
          Welcome to your Words collection!
        </ThemedText>
        <ThemedText style={styles.infoText}>
          Here you can view and manage all your vocabulary words.
        </ThemedText>

        <ThemedView style={styles.placeholder}>
          <ThemedText style={styles.placeholderText}>
            No words added yet. Use the "Add" tab to start building your
            vocabulary!
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 30,
    opacity: 0.7,
  },
  placeholder: {
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 150,
    opacity: 0.6,
  },
  placeholderText: {
    textAlign: "center",
    fontSize: 14,
  },
});
