import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { UserCreatePayload } from "@/types/user";
import { useAuth } from "../providers/AuthProvider";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const payload: UserCreatePayload = { email, password, firstName, lastName };

    const success = await register(payload);
    if (success) {
      Alert.alert("Registration Successful", `Account created for ${email}!`);
      router.replace("/home" as any);
    } else {
      Alert.alert("Registration Failed", "Please try again");
    }
  };

  const handleLoginNavigation = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ title: "Register", headerShown: false }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Register
        </ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="none"
          editable={!isLoading}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="none"
          editable={!isLoading}
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
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
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!isLoading}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>
            {isLoading ? "Creating account..." : "Register"}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLoginNavigation} disabled={isLoading}>
          <ThemedText style={styles.loginLink}>
            Already have an account? Login
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
    marginBottom: 30,
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
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginLink: {
    textAlign: "center",
    color: "#007AFF",
    fontSize: 14,
  },
});
