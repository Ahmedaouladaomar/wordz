import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { toast } from "react-native-sonner";
import { Text, View, YStack } from "tamagui";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { GradientButton } from "@/components/ui/gradient-button";
import { useAuth } from "@/providers/AuthProvider";

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
      <View style={styles.container} bg="$brandPrimaryLight">
        <Card px={25} py={40}>
          <ThemedText type="title" style={styles.title}>
            Verify Code
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Enter the 6-digit code sent to {email}
          </ThemedText>
          {/* Modern Separated Input Container */}
          <YStack ai="center" jc="center" mb={30} gap={8}>
            <View style={styles.otpContainer}>
              {codeDigits.map((_, index) => {
                const char = code[index] || "";
                const isFocused = code.length === index;

                return (
                  <View
                    key={index}
                    style={[
                      styles.otpBox,
                      isFocused && styles.otpBoxFocused,
                      char !== "" && styles.otpBoxFilled,
                    ]}
                  >
                    <ThemedText style={styles.otpText}>{char}</ThemedText>
                  </View>
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
            </View>
          </YStack>

          <ThemedText style={styles.resendText}>
            Didn&apos;t receive the code? Check your spam folder or request a
            new one.
          </ThemedText>
          <GradientButton
            bg="$brandPrimary"
            color="white"
            br="$12"
            height={60}
            mb={20}
            borderWidth={0}
            onPress={handleVerifyCode}
            disabled={false}
          >
            <Text col="white" fos="$lg">
              Verify Code
            </Text>
          </GradientButton>
          <TouchableOpacity onPress={handleBackToForgotPassword}>
            <ThemedText style={styles.backLink}>
              Back to Forgot Password
            </ThemedText>
          </TouchableOpacity>
        </Card>
      </View>
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
    marginBottom: 20,
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
    position: "relative",
    width: "100%",
  },
  otpBox: {
    width: 45,
    height: 55,
    borderWidth: 1.5,
    borderColor: "#006572",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  otpBoxFocused: {
    borderColor: "#008a9c",
    borderWidth: 2,
  },
  otpBoxFilled: {
    backgroundColor: "#f0f8fa",
  },
  otpText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: "100%",
    height: "100%",
  },
  resendText: {
    textAlign: "center",
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 20,
    lineHeight: 18,
  },
  backLink: {
    textAlign: "center",
    color: "#008a9c",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
