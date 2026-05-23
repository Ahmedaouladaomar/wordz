import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

export default function PracticeScreen() {
  const [practiceMode, setPracticeMode] = useState<"idle" | "active">("idle");

  const handleStartPractice = () => {
    setPracticeMode("active");
    // TODO: Load random words and start practice session
  };

  const handleStopPractice = () => {
    setPracticeMode("idle");
  };

  if (practiceMode === "active") {
    return (
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText style={styles.subtitle}>Practice Session</ThemedText>

          <ThemedView style={styles.card}>
            <ThemedText style={styles.cardLabel}>Word</ThemedText>
            <ThemedText style={styles.cardContent}>Example Word</ThemedText>
          </ThemedView>

          <ThemedView style={styles.card}>
            <ThemedText style={styles.cardLabel}>Definition</ThemedText>
            <ThemedText style={styles.cardContent}>
              A sample definition of the word
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.answerButtons}>
            <TouchableOpacity style={[styles.answerButton, styles.wrongButton]}>
              <ThemedText style={styles.buttonText}>❌ Wrong</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.answerButton, styles.correctButton]}
            >
              <ThemedText style={styles.buttonText}>✅ Correct</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <TouchableOpacity
            style={[styles.button, styles.stopButton]}
            onPress={handleStopPractice}
          >
            <ThemedText style={styles.buttonText}>End Session</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText style={styles.subtitle}>Ready to practice?</ThemedText>
        <ThemedText style={styles.infoText}>
          Test your knowledge and improve your vocabulary retention!
        </ThemedText>

        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statBox}>
            <ThemedText style={styles.statNumber}>0</ThemedText>
            <ThemedText style={styles.statLabel}>Words Practiced</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statBox}>
            <ThemedText style={styles.statNumber}>0%</ThemedText>
            <ThemedText style={styles.statLabel}>Accuracy</ThemedText>
          </ThemedView>
        </ThemedView>

        <TouchableOpacity style={styles.button} onPress={handleStartPractice}>
          <ThemedText style={styles.buttonText}>Start Practice</ThemedText>
        </TouchableOpacity>
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
    alignItems: "center",
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
  card: {
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.6,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  cardContent: {
    fontSize: 18,
    fontWeight: "600",
  },
  answerButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    gap: 10,
  },
  answerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  wrongButton: {
    backgroundColor: "#FF3B30",
  },
  correctButton: {
    backgroundColor: "#34C759",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  stopButton: {
    backgroundColor: "#FF9500",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
