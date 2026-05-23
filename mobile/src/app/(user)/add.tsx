import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

export default function AddScreen() {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");

  const handleAddWord = () => {
    if (word.trim() && definition.trim()) {
      // TODO: Add word to API/storage
      setWord("");
      setDefinition("");
      alert("Word added successfully!");
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText style={styles.subtitle}>
          Add a new word to your collection
        </ThemedText>

        <ThemedView style={styles.form}>
          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Word</ThemedText>
            <ThemedView style={styles.input}>
              <ThemedText>{word || "Enter a word..."}</ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Definition</ThemedText>
            <ThemedView style={[styles.input, styles.textArea]}>
              <ThemedText>{definition || "Enter the definition..."}</ThemedText>
            </ThemedView>
          </ThemedView>

          <TouchableOpacity style={styles.button} onPress={handleAddWord}>
            <ThemedText style={styles.buttonText}>Add Word</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.info}>
          <ThemedText style={styles.infoText}>
            💡 Tip: Be descriptive with your definitions to help you remember
            better!
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
    marginBottom: 20,
  },
  form: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  info: {
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  infoText: {
    fontSize: 14,
  },
});
