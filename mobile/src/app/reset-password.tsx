import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "../providers/AuthProvider";

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();
  const { resetPassword, isLoading } = useAuth();

  const handleResetPassword = async () => {
    if (!token) {
      Alert.alert("Error", "Invalid reset link. Please request a new one.");
      router.replace("/login");
      return;
    }

    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please enter both password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    const success = await resetPassword(token, newPassword);
    if (success) {
      Alert.alert("Success", "Your password has been reset successfully");
      router.replace("/login");
    } else {
      Alert.alert(
        "Error",
        "Failed to reset password. The link may have expired. Please request a new one.",
      );
    }
  };

  const handleBackToLogin = () => {
    router.replace("/login");
  };

  return (
    <>
      <Stack.Screen options={{ title: "Reset Password", headerShown: false }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Reset Password
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Enter your new password below
        </ThemedText>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          editable={!isLoading}
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!isLoading}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleBackToLogin} disabled={isLoading}>
          <ThemedText style={styles.backLink}>Back to Login</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 15,
    fontSize: 32,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 30,
    fontSize: 14,
    opacity: 0.7,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backLink: {
    textAlign: "center",
    color: "#007AFF",
    fontSize: 14,
  },
});
