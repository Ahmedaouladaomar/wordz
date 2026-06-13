import { ThemedView } from "@/components/themed-view";
import { TextInput } from "@/components/ui/text-input";
import { vocabularyService } from "@/services/vocabularyService";
import { X } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Text, useTheme, XStack, YStack } from "tamagui";
import { CircleSpinner } from "./ui/circle-spinner";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormInputs {
  word: string;
  definition: string;
  example: string;
}

export function AddWord({ visible, onClose, onSuccess }: Props) {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === "dark";
  const brandPrimary = theme.brandPrimary?.get();
  const brandPrimaryLight = theme.brandPrimaryLight?.get();

  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      word: "",
      definition: "",
      example: "",
    },
  });

  const onSubmit = async (data: FormInputs) => {
    setIsLoading(true);
    try {
      const response = await vocabularyService.createVocabulary({
        term: data.word.trim(),
        definition: data.definition.trim(),
        example: data.example.trim(),
      });

      if (response.success) {
        reset();
        onSuccess?.();
        onClose();
      } else {
        console.error(response.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancelClose}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={handleCancelClose} />

      {/* Modal Content */}
      <YStack
        bc="$brandPrimaryLight"
        style={[
          styles.container,
          {
            top: insets.top,
            backgroundColor: isDark ? "#121212" : brandPrimaryLight,
          },
        ]}
      >
        {/* Header */}
        <XStack style={styles.header} jc="space-between" ai="center">
          <XStack f={1} />
          <Text
            fos="$lg"
            fow={600}
            col="$brandPrimary"
            f={2}
            style={{ textAlign: "center" }}
          >
            Add New Word
          </Text>
          <XStack jc="flex-end" f={1}>
            <TouchableOpacity
              onPress={handleCancelClose}
              style={styles.closeButton}
            >
              <X size={24} col={brandPrimary} />
            </TouchableOpacity>
          </XStack>
        </XStack>

        {/* Scrollable Content */}
        <YStack style={styles.content} gap={18}>
          {/* Word Input */}
          <YStack gap={6}>
            <Controller
              control={control}
              name="word"
              rules={{ required: "Word field cannot be empty" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedView
                  style={[
                    styles.inputSection,
                    {
                      backgroundColor: isDark ? "#1a1a1a" : "white",
                      borderColor: errors.word ? "#ff4d4f" : "transparent", // 👈 Highlights container border on error
                    },
                  ]}
                >
                  <TextInput
                    label="Word"
                    placeholder="e.g. Ephemeral"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    editable={!isLoading}
                  />
                </ThemedView>
              )}
            />
            {errors.word && (
              <Text style={styles.errorText} fos="$md" fow="500">
                {errors.word.message}
              </Text>
            )}
          </YStack>

          {/* Definition Input */}
          <YStack gap={6}>
            <Controller
              control={control}
              name="definition"
              rules={{ required: "Definition field cannot be empty" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedView
                  style={[
                    styles.inputSection,
                    {
                      backgroundColor: isDark ? "#1a1a1a" : "white",
                      borderColor: errors.definition
                        ? "#ff4d4f"
                        : "transparent",
                    },
                  ]}
                >
                  <TextInput
                    label="Definition"
                    placeholder="What does it mean?"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={4}
                    editable={!isLoading}
                  />
                </ThemedView>
              )}
            />
            {errors.definition && (
              <Text style={styles.errorText} fos="$md" fow="500">
                {errors.definition.message}
              </Text>
            )}
          </YStack>

          {/* Example Input */}
          <YStack gap={6}>
            <Controller
              control={control}
              name="example"
              rules={{ required: "Please provide an example sentence" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedView
                  style={[
                    styles.inputSection,
                    {
                      backgroundColor: isDark ? "#1a1a1a" : "white",
                      borderColor: errors.example ? "#ff4d4f" : "transparent",
                    },
                  ]}
                >
                  <TextInput
                    label="Example sentence"
                    placeholder="Use in a sentence..."
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={3}
                    editable={!isLoading}
                  />
                </ThemedView>
              )}
            />
            {errors.example && (
              <Text style={styles.errorText} fos="$md" fow="500">
                {errors.example.message}
              </Text>
            )}
          </YStack>
        </YStack>

        {/* Action Buttons */}
        <YStack f={1} paddingInline={20} mt={16}>
          <Button
            br={20}
            bc="$brandPrimary"
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            o={isLoading ? 0.5 : 1}
          >
            <Text style={styles.buttonText} fos="$lg" fow="600">
              {isLoading ? <CircleSpinner /> : "Save"}
            </Text>
          </Button>
        </YStack>
      </YStack>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    height: "100%",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingBottom: 20,
    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: "75%",
  },
  inputSection: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  errorText: {
    color: "#ff4d4f",
    marginTop: 5,
    marginBottom: 10,
    paddingLeft: 12,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
