import { Stack, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "../providers/AuthProvider";

export default function DashboardScreen() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated || !user) {
    return null; // Route guard will redirect before this renders
  }

  const handleGoHome = () => {
    router.back();
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login" as any);
  };

  return (
    <>
      <Stack.Screen options={{ title: "Dashboard" }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Dashboard
        </ThemedText>
        <ThemedText style={styles.welcomeText}>
          Hello, {user.firstName} {user.lastName}!
        </ThemedText>
        <ThemedText style={styles.infoText}>Email: {user.email}</ThemedText>

        <TouchableOpacity style={styles.button} onPress={handleGoHome}>
          <ThemedText style={styles.buttonText}>Back to Home</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <ThemedText style={styles.buttonText}>Logout</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 32,
  },
  welcomeText: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 10,
  },
  infoText: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 40,
    opacity: 0.7,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
