import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { toast } from "react-native-sonner";
import { Text, View } from "tamagui";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { GradientButton } from "@/components/ui/gradient-button";
import { TextInput } from "@/components/ui/text-input";
import { useAuth } from "@/providers/AuthProvider";

export default function VerifyEmailScreen() {
  const [code, setCode] = useState("");
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { verifyEmail } = useAuth();

  const handleVerifyCode = async () => {
    if (!email) {
      toast.error("Email is missing. Please try again.");
      router.replace("/register");
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
    const success = await verifyEmail(email, code);

    if (success) {
      toast.success("Email verified! You can now login.");
      router.replace("/login");
    } else {
      toast.error("Wrong code, please try again");
    }
  };

  const handleBackToLogin = () => {
    router.replace("/login");
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
          <TextInput
            label="Verification Code"
            placeholder="000000"
            value={code}
            mb={15}
            onChangeText={setCode}
            keyboardType="numeric"
            maxLength={6}
          />
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
            mt={15}
          >
            <Text col="white" fos="$lg">
              Verify Code
            </Text>
          </GradientButton>
          <TouchableOpacity onPress={handleBackToLogin}>
            <ThemedText style={styles.backLink}>Back to login</ThemedText>
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
