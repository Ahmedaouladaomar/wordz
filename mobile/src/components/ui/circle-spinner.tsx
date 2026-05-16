import { LoaderCircle } from "@tamagui/lucide-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { YStack } from "tamagui";

export const CircleSpinner = ({ size = 28, color = "$brandPrimary" }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();
    return () => animation.stop(); // Cleanup on unmount
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <YStack ai="center" jc="center">
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <LoaderCircle size={size} color={color} strokeWidth={2.5} />
      </Animated.View>
    </YStack>
  );
};
