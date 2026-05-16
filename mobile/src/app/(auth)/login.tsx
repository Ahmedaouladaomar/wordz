import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { toast } from "react-native-sonner";
import { Text, View, XStack } from "tamagui";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { CircleSpinner } from "@/components/ui/circle-spinner";
import { GradientButton } from "@/components/ui/gradient-button";
import { TextInput } from "@/components/ui/text-input";
import { useAuth } from "@/providers/AuthProvider";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      const fieldsArr = [];
      if (!email) {
        fieldsArr.push("email");
      }
      if (!password) {
        fieldsArr.push("password");
      }
      const fieldsText = fieldsArr.join(" and ");
      toast.error(`Please enter ${fieldsText}`);
      return;
    }

    const isLoggedIn = await login(email, password);

    if (isLoggedIn) {
      toast.success("Login Successful!");
      router.replace("/home" as any);
    } else {
      toast.error("Login failed. Invalid credentials");
    }
  };

  const handleRegisterNavigation = () => {
    router.push("/register");
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <>
      <Stack.Screen options={{ title: "Login", headerShown: false }} />
      <View style={styles.container} bg="$brandPrimaryLight">
        <Card px={25} py={40}>
          <ThemedText type="title" style={styles.title}>
            Login
          </ThemedText>
          <TextInput
            label="Email"
            placeholder="test@example.com"
            value={email}
            mb={15}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading}
          />
          <TextInput
            label="Password"
            placeholder="Password"
            value={password}
            marginBottom={20}
            onChangeText={setPassword}
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
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircleSpinner color="white" />
            ) : (
              <Text color="white" fos="$lg">
                Login
              </Text>
            )}
          </GradientButton>
          <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
            <ThemedText style={styles.forgotLink}>Forgot Password?</ThemedText>
          </TouchableOpacity>

          <XStack jc="center" ai="center" gap={5}>
            <Text style={styles.registerText}>Don&apos;t have an account?</Text>
            <TouchableOpacity
              onPress={handleRegisterNavigation}
              disabled={isLoading}
            >
              <ThemedText style={styles.registerLink}>Register</ThemedText>
            </TouchableOpacity>
          </XStack>
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
    marginBottom: 40,
    fontSize: 32,
  },
  forgotLink: {
    textAlign: "center",
    color: "#008a9c",
    fontSize: 14,
    marginBottom: 5,
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  registerText: {
    color: "#008a9c",
    fontSize: 14,
    fontWeight: "600",
  },
  registerLink: {
    color: "#008a9c",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
