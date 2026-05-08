import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "react-native-sonner";

const CODE_LENGTH = 6;
const codeDigits = Array(CODE_LENGTH).fill(0);

export default function VerifyResetCodeScreen() {
  const [code, setCode] = useState("");
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { verifyResetPasswordCode } = useAuth();

  const handleVerifyCode = async () => {
    if (!email) {
      toast.error("Email is missing. Please try again.");
      router.replace("/forgot-password");
      return;
    }

    if (!code) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    if (code.length !== 6) {
      toast.error("Code must be exactly 6 digits");
      return;
    }

    if (!/^\d+$/.test(code)) {
      toast.error("Code must contain only numbers");
      return;
    }

    // The backend will validate the code
    const success = await verifyResetPasswordCode({ email, code });

    if (success) {
      // Navigate directly to reset-password with email and code
      router.push({
        pathname: "/reset-password",
        params: { email, code },
      });
    } else {
      toast.error("Invalid or expired reset code");
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
        {/* Modern Separated Input Container */}
        <ThemedView style={styles.otpContainer}>
          {codeDigits.map((_, index) => {
            const char = code[index] || "";
            const isFocused = code.length === index;

            return (
              <ThemedView
                key={index}
                style={[
                  styles.otpBox,
                  isFocused && styles.otpBoxFocused,
                  char !== "" && styles.otpBoxFilled,
                ]}
              >
                <ThemedText style={styles.otpText}>{char}</ThemedText>
              </ThemedView>
            );
          })}

          {/* The "Invisible" Actual Input */}
          <TextInput
            style={styles.hiddenInput}
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
            maxLength={CODE_LENGTH}
            autoFocus={true}
            caretHidden={true}
          />
        </ThemedView>
        <ThemedText style={styles.resendText}>
          Didn&apos;t receive the code? Check your spam folder or request a new
          one.
        </ThemedText>
        <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
          <ThemedText style={styles.buttonText}>Verify Code</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleBackToForgotPassword}>
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    position: "relative",
  },
  otpBox: {
    width: 45,
    height: 55,
    borderWidth: 1.5,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  otpBoxFocused: {
    borderColor: "#007AFF",
    backgroundColor: "#fff",
    // Optional: add a small shadow for focus
    elevation: 2,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  otpBoxFilled: {
    borderColor: "#007AFF",
  },
  otpText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0, // Keeps it functional but invisible
    fontSize: 1, // Fixes cursor issues on some Android versions
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
