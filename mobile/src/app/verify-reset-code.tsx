import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "../providers/AuthProvider";

export default function VerifyResetCodeScreen() {
  const [code, setCode] = useState("");
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { verifyResetCode, isLoading } = useAuth();

  const handleVerifyCode = async () => {
    if (!email) {
      Alert.alert("Error", "Email is missing. Please try again.");
      router.replace("/forgot-password");
      return;
    }

    if (!code) {
      Alert.alert("Error", "Please enter the 6-digit code");
      return;
    }

    if (code.length !== 6) {
      Alert.alert("Error", "Code must be exactly 6 digits");
      return;
    }

    if (!/^\d+$/.test(code)) {
      Alert.alert("Error", "Code must contain only numbers");
      return;
    }

    const success = await verifyResetCode(email, code);
    if (success) {
      router.push({
        pathname: "/reset-password",
        params: { email, code },
      });
    } else {
      Alert.alert(
        "Error",
        "Invalid or expired code. Please request a new one.",
      );
    }
  };

  const handleBackToForgotPassword = () => {
    router.replace("/forgot-password");
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Verify Code",
          headerShown: false,
        }}
      />
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Verify Code
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Enter the 6-digit code sent to {email}
        </ThemedText>
        <TextInput
          style={styles.input}
          placeholder="000000"
          value={code}
          onChangeText={setCode}
          keyboardType="numeric"
          maxLength={6}
          editable={!isLoading}
          placeholderTextColor="#999"
          textAlign="center"
        />
        <ThemedText style={styles.resendText}>
          Didn&apos;t receive the code? Check your spam folder or request a new
          one.
        </ThemedText>
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleVerifyCode}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>
            {isLoading ? "Verifying..." : "Verify Code"}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleBackToForgotPassword}
          disabled={isLoading}
        >
          <ThemedText style={styles.backLink}>
            Back to Forgot Password
          </ThemedText>
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
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 8,
  },
  resendText: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 12,
    opacity: 0.6,
    lineHeight: 18,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  backLink: {
    textAlign: "center",
    color: "#007AFF",
    fontSize: 14,
  },
});
