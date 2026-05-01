import { Stack, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "../providers/AuthProvider";

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <>
      <Stack.Screen options={{ title: "Home", headerShown: false }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Home
        </ThemedText>
        <ThemedText style={styles.welcomeText}>
          Welcome, {user?.firstName} {user?.lastName}!
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          This is a protected page - you must be logged in to see it.
        </ThemedText>

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
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 20,
    opacity: 0.7,
  },
  loading: {
    marginVertical: 20,
  },
  error: {
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 14,
  },
  dataContainer: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    padding: 20,
    borderRadius: 8,
    marginBottom: 30,
    width: "100%",
    alignItems: "center",
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#007AFF",
  },
  dataText: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
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
