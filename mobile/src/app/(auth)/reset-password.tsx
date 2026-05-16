import { Stack, useLocalSearchParams, useRouter } from "expo-router";
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

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const { email, code } = useLocalSearchParams<{
    email: string;
    code: string;
  }>();
  const { resetPasswordWithCode, isLoading } = useAuth();

  const handleResetPassword = async () => {
    if (!email || !code) {
      toast.error("Invalid reset request. Please try again.");
      router.replace("/forgot-password");
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error("Please enter both password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    const success = await resetPasswordWithCode({ email, code, newPassword });
    if (success) {
      toast.success("Your password has been reset successfully");
      router.replace("/login");
    } else {
      toast.error(
        "Failed to reset password. The code may have expired. Please request a new one.",
      );
    }
  };

  const handleBackToLogin = () => {
    router.replace("/login");
  };

  return (
    <>
      <Stack.Screen options={{ title: "Reset Password", headerShown: false }} />
      <View style={styles.container} bg="$brandPrimaryLight">
        <Card px={25} py={40}>
          <ThemedText type="title" style={styles.title}>
            Reset Password
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Enter your new password below
          </ThemedText>
          <TextInput
            label="New Password"
            placeholder="Password"
            value={newPassword}
            mb={15}
            onChangeText={setNewPassword}
            secureTextEntry
            editable={!isLoading}
          />
          <TextInput
            label="Confirm Password"
            placeholder="Confirm Password"
            value={confirmPassword}
            marginBottom={20}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!isLoading}
          />
          <GradientButton
            bg="$brandPrimary"
            color="white"
            br="$12"
            height={60}
            mb={20}
            borderWidth={0}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircleSpinner color="white" />
            ) : (
              <Text col="white" fos="$lg">
                Reset Password
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
  },
  backLink: {
    textAlign: "center",
    color: "#008a9c",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
