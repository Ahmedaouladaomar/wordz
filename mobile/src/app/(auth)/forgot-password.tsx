import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { toast } from "react-native-sonner";
import { Text, View } from "tamagui";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { CircleSpinner } from "@/components/ui/circle-spinner";
import { GradientButton } from "@/components/ui/gradient-button";
import { TextInput } from "@/components/ui/text-input";
import { useAuth } from "@/providers/AuthProvider";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { requestResetPassword, isLoading } = useAuth();

  const handleRequestReset = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    const success = await requestResetPassword(email);
    if (success) {
      toast.success(
        "If an account exists with this email, you will receive a 6-digit code shortly.",
      );
      router.push({
        pathname: "/verify-reset-code",
        params: { email },
      });
    } else {
      toast.error("Failed to request password reset. Please try again.");
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
      <View style={styles.container} bg="$brandPrimaryLight">
        <Card px={25} py={40}>
          <ThemedText type="title" style={styles.title}>
            Forgot Password
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Enter your email address and we&apos;ll send you a 6-digit code to
            reset your password.
          </ThemedText>
          <TextInput
            label="Email"
            placeholder="test@example.com"
            value={email}
            mb={20}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading}
          />
          <GradientButton
            bg="$brandPrimary"
            color="white"
            br="$12"
            height={60}
            mb={20}
            borderWidth={0}
            onPress={handleRequestReset}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircleSpinner color="white" />
            ) : (
              <Text col="white" fos="$lg">
                Send Code
              </Text>
            )}
          </GradientButton>
          <TouchableOpacity onPress={handleBackToLogin} disabled={isLoading}>
            <ThemedText style={styles.backLink}>Back to Login</ThemedText>
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
  backLink: {
    textAlign: "center",
    color: "#008a9c",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
