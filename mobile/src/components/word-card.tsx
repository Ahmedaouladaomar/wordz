import { ThemedText } from "@/components/themed-text";
import { formatTimeAgo } from "@/helpers/date.helper";
import { FileQuestion, Heart, Volume2 } from "@tamagui/lucide-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { Text, useTheme, View, XStack } from "tamagui";

interface WordCardProps {
  id: string;
  title: string;
  description: string;
  addedAt: Date;
  status: "new" | "mastered" | "favourite" | null;
  onPronounce?: () => void;
  onPractice?: () => void;
  onPress?: () => void;
}

export function WordCard({
  title,
  description,
  addedAt,
  status,
  onPronounce,
  onPractice,
  onPress,
}: WordCardProps) {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const isDark = colorScheme === "dark";
  const brandPrimary = theme.brandPrimary?.get();

  const getStatusBadge = () => {
    if (!status) return;
    if (status === "favourite") {
      return <Heart size={20} col={brandPrimary} fill={brandPrimary} />;
    }
    return (
      <Text
        style={[
          styles.statusBadge,
          {
            backgroundColor: "#90E3F9",
            color: "#005361",
            borderRadius: 20,
            paddingHorizontal: 15,
            paddingVertical: 1,
            textTransform: "uppercase",
          },
        ]}
      >
        {status === "new" ? "new" : "mastered"}
      </Text>
    );
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark ? "#1a1a1a" : "white",
            borderColor: isDark ? "#2a2a2a" : "white",
          },
        ]}
      >
        <XStack style={styles.header}>
          <ThemedText
            style={[
              styles.title,
              {
                color: brandPrimary,
                flex: 1,
              },
            ]}
          >
            {title}
          </ThemedText>
          {getStatusBadge()}
        </XStack>

        {/* Description */}
        <ThemedText
          style={[
            styles.description,
            {
              color: isDark ? "#ccc" : "#666",
            },
          ]}
        >
          {description}
        </ThemedText>

        <XStack style={styles.footer}>
          {status && onPractice && (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={status === "mastered" ? onPronounce : onPractice}
              >
                <XStack style={styles.actionContent}>
                  {status === "mastered" ? (
                    <Volume2 size={16} col={brandPrimary} />
                  ) : (
                    <FileQuestion size={16} col={brandPrimary} />
                  )}
                  <ThemedText
                    style={[
                      styles.actionText,
                      {
                        color: brandPrimary,
                      },
                    ]}
                  >
                    {status === "mastered" ? "Pronounce" : "Practice"}
                  </ThemedText>
                </XStack>
              </TouchableOpacity>

              <ThemedText
                style={[
                  styles.separator,
                  {
                    color: isDark ? "#444" : "#ccc",
                  },
                ]}
              >
                •
              </ThemedText>
            </>
          )}

          <ThemedText
            style={[
              styles.timeText,
              {
                color: isDark ? "#888" : "#999",
              },
            ]}
          >
            Added {formatTimeAgo(addedAt)} ago
          </ThemedText>
        </XStack>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    textAlign: "center",
    textAlignVertical: "center",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionContent: {
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "500",
  },
  separator: {
    fontSize: 12,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "400",
  },
});
