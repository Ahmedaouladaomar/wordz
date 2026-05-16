import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "tamagui";
import { z } from "zod";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { CircleSpinner } from "@/components/ui/circle-spinner";
import { GradientButton } from "@/components/ui/gradient-button";
import { TextInput } from "@/components/ui/text-input";
import { useAuth } from "@/providers/AuthProvider";
import { UserCreatePayload } from "@/types/user";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const payload: UserCreatePayload = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    };

    const success = await register(payload);

    if (success) {
      Alert.alert("Success", `Verification code sent to ${data.email}!`);
      router.replace({
        pathname: "/verify-email",
        params: { email: data.email },
      });
    } else {
      Alert.alert("Error", "Registration failed. Please try again.");
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Register", headerShown: false }} />
      <View style={{ flex: 1 }} bg="$brandPrimaryLight">
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.spacer} />
          <Card px={25} py={40}>
            <ThemedText type="title" style={styles.title}>
              Register
            </ThemedText>

            {/* First Name */}
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    label="First Name"
                    placeholder="John"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="words"
                    editable={!isLoading}
                    mb={errors.firstName ? 5 : 15}
                  />
                  {errors.firstName && (
                    <ThemedText style={styles.errorText}>
                      {errors.firstName.message}
                    </ThemedText>
                  )}
                </>
              )}
            />

            {/* Last Name */}
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    label="Last Name"
                    placeholder="Doe"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="words"
                    editable={!isLoading}
                    mb={errors.lastName ? 5 : 15}
                  />
                  {errors.lastName && (
                    <ThemedText style={styles.errorText}>
                      {errors.lastName.message}
                    </ThemedText>
                  )}
                </>
              )}
            />

            {/* Email */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    label="Email"
                    placeholder="john@example.com"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                    mb={errors.email ? 5 : 15}
                  />
                  {errors.email && (
                    <ThemedText style={styles.errorText}>
                      {errors.email.message}
                    </ThemedText>
                  )}
                </>
              )}
            />

            {/* Password */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    label="Password"
                    placeholder="Password"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    editable={!isLoading}
                    mb={errors.password ? 5 : 15}
                  />
                  {errors.password && (
                    <ThemedText style={styles.errorText}>
                      {errors.password.message}
                    </ThemedText>
                  )}
                </>
              )}
            />

            {/* Confirm Password */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    editable={!isLoading}
                    mb={errors.confirmPassword ? 5 : 20}
                  />
                  {errors.confirmPassword && (
                    <ThemedText style={styles.errorText}>
                      {errors.confirmPassword.message}
                    </ThemedText>
                  )}
                </>
              )}
            />

            <GradientButton
              bg="$brandPrimary"
              color="white"
              br="$12"
              height={60}
              mb={20}
              borderWidth={0}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircleSpinner color="white" />
              ) : (
                <Text col="white" fos="$lg">
                  Register
                </Text>
              )}
            </GradientButton>

            <TouchableOpacity
              onPress={() => router.push("/login")}
              disabled={isLoading}
            >
              <ThemedText style={styles.loginLink}>
                Already have an account? Login
              </ThemedText>
            </TouchableOpacity>
          </Card>
          <View style={styles.spacer} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: "center",
  },
  spacer: {
    minHeight: 40,
  },
  title: {
    textAlign: "center",
    marginBottom: 40,
    fontSize: 32,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 8,
    fontWeight: "500",
  },
  loginLink: {
    textAlign: "center",
    color: "#008a9c",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
