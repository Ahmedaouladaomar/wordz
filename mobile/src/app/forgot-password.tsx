import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "../providers/AuthProvider";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { requestPasswordReset, isLoading } = useAuth();

  const handleRequestReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    const success = await requestPasswordReset(email);
    if (success) {
      Alert.alert(
        "Success",
        "If an account exists with this email, you will receive a 6-digit code shortly.",
      );
      router.push({
        pathname: "/verify-reset-code",
        params: { email },
      });
    } else {
      Alert.alert(
        "Error",
        "Failed to request password reset. Please try again.",
      );
    }
  };

  const handleBackToLogin = () => {
    router.replace("/login");
  };

  return (
    <>
      <Stack.Screen
        options={{ title: "Forgot Password", headerShown: false }}
      />
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Forgot Password
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Enter your email address and we&apos;ll send you a 6-digit code to
          reset your password.
        </ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isLoading}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRequestReset}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>
            {isLoading ? "Sending..." : "Send Code"}
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
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 20,
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
