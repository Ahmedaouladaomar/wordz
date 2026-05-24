import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { toast } from "react-native-sonner";
import { Separator, Text, View, XStack, YStack } from "tamagui";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { CircleSpinner } from "@/components/ui/circle-spinner";
import { GradientButton } from "@/components/ui/gradient-button";
import { TextInput } from "@/components/ui/text-input";
import { useAuth } from "@/providers/AuthProvider";
import { Mail } from "@tamagui/lucide-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingGoogleSignIn, setLoadingGoogleSignIn] = useState(false);
  const router = useRouter();
  const { login, isLoading, loginWithGoogle } = useAuth();

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
      router.replace("/(user)/words");
    } else {
      toast.error("Login failed. Invalid credentials");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        toast.error("Failed to get ID token from Google");
        return;
      }

      setLoadingGoogleSignIn(true);

      const isLoggedIn = await loginWithGoogle(idToken);

      if (isLoggedIn) {
        toast.success("Login Successful!");
        router.replace("/(user)/words");
      } else {
        toast.error("Google login failed. Please try again");
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        toast.error("Sign in cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        toast.error("Sign in already in progress");
      } else {
        // Show the actual error description to your UI toast
        toast.error(
          `Google sign-in failed: ${error.message || error.code || "Unknown Error"}`,
        );
      }
    } finally {
      setLoadingGoogleSignIn(false);
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
          <YStack ai="center" gap={5} mb={30}>
            <Text color="$brandPrimary" fos="$xl" fow="700">
              Get Started
            </Text>
            <Text fos="$md" color="$brandPrimary" fow="400">
              Level up your vocabulary game.
            </Text>
          </YStack>

          <TouchableOpacity
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            style={styles.googleButtonContainer}
          >
            <XStack style={styles.googleButton}>
              {loadingGoogleSignIn ? (
                <CircleSpinner />
              ) : (
                <>
                  <Mail width={20} height={20} color="#333" />
                  <Text style={styles.googleButtonText}>
                    Sign in with Google
                  </Text>
                </>
              )}
            </XStack>
          </TouchableOpacity>

          <XStack jc="center" ai="center" my={10} gap={10}>
            <Separator borderColor="#7eb5be46" flex={1} />
            <Text color="$brandPrimary" fos="$sm" fow="600">
              OR EMAIL
            </Text>
            <Separator borderColor="#7eb5be46" flex={1} />
          </XStack>

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
  googleButtonContainer: {
    marginBottom: 20,
  },
  googleButton: {
    gap: 10,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
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
