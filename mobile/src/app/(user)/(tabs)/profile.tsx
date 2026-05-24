import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/providers/AuthProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function ProfileScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.profileHeader}>
          <ThemedView
            style={[
              styles.avatar,
              { backgroundColor: isDark ? "#333" : "#e0e0e0" },
            ]}
          >
            <MaterialCommunityIcons
              name="account"
              size={48}
              color={isDark ? "#fff" : "#000"}
            />
          </ThemedView>
          <ThemedText style={styles.name}>
            {user?.firstName} {user?.lastName}
          </ThemedText>
          <ThemedText style={styles.email}>{user?.email}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Statistics</ThemedText>
          <ThemedView style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Total Words</ThemedText>
            <ThemedText style={styles.statValue}>0</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Practice Sessions</ThemedText>
            <ThemedText style={styles.statValue}>0</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Accuracy Rate</ThemedText>
            <ThemedText style={styles.statValue}>-</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>
          <ThemedView style={styles.infoBox}>
            <ThemedText style={styles.infoLabel}>Email</ThemedText>
            <ThemedText style={styles.infoValue}>{user?.email}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.infoBox}>
            <ThemedText style={styles.infoLabel}>Member Since</ThemedText>
            <ThemedText style={styles.infoValue}>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Unknown"}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>About</ThemedText>
          <ThemedText style={styles.aboutText}>
            Wordz helps you build and practice your vocabulary with a simple,
            effective learning system.
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
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#007AFF",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    opacity: 0.6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#007AFF",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  statLabel: {
    fontSize: 14,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  infoBox: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  infoLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
  },
});
