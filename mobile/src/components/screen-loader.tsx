import React from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

interface Props {
  isVisible: boolean;
  message?: string;
}

export const ScreenLoader = ({ isVisible, message = "Loading..." }: Props) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={() => {}}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color="#4F46E5" />
          {message && <Text style={styles.text}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Dimmed background
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
});
