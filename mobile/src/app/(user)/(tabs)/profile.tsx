import { useAuth } from "@/providers/AuthProvider";
import { User } from "@tamagui/lucide-icons";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Avatar, Text, View } from "tamagui";

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <Avatar circular size="$5" bc="$brandPrimary" mb="$4">
          <User size="$2" col="white" />
        </Avatar>

        <Text style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle} col="$brandPrimary">
          Statistics
        </Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Words</Text>
          <Text style={styles.statValue}>{user?.totalWords || 0}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Practice Sessions</Text>
          <Text style={styles.statValue}>
            {user?.totalPracticeSssions || 0}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle} col="$brandPrimary">
          Account
        </Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Member Since</Text>
          <Text style={styles.infoValue}>
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "Unknown"}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle} col="$brandPrimary">
          About
        </Text>
        <Text style={styles.aboutText}>
          Wordz helps you build and practice your vocabulary with a simple,
          effective learning system.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  profileHeader: {
    alignItems: "center",
    paddingBottom: 35,
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
