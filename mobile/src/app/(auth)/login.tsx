import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { toast } from "react-native-sonner";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
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
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Login
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
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>
            {isLoading ? "Logging in..." : "Login"}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
          <ThemedText style={styles.forgotLink}>Forgot Password?</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleRegisterNavigation}
          disabled={isLoading}
        >
          <ThemedText style={styles.registerLink}>
            Don&apos;t have an account? Register
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
    marginBottom: 40,
    fontSize: 32,
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
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  forgotLink: {
    textAlign: "center",
    color: "#007AFF",
    fontSize: 14,
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  registerLink: {
    textAlign: "center",
    color: "#007AFF",
    fontSize: 14,
  },
});
