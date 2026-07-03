import { useMemo, useRef, useState } from "react";
import { Animated } from "react-native";

/**
 * Hook for creating and managing a rotation animation around 'y' axis
 * @returns
 */
export const useFlipAnimation = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  const flipToFrontStyle = useMemo(() => {
    const frontInterpolate = flipAnimation.interpolate({
      inputRange: [0, 180],
      outputRange: ["0deg", "180deg"],
    });

    return {
      transform: [{ rotateY: frontInterpolate }],
      backfaceVisibility: "hidden" as const,
    };
  }, [flipAnimation]);

  const flipToBackStyle = useMemo(() => {
    const backInterpolate = flipAnimation.interpolate({
      inputRange: [0, 180],
      outputRange: ["180deg", "360deg"],
    });

    return {
      transform: [{ rotateY: backInterpolate }],
      backfaceVisibility: "hidden" as const,
    };
  }, [flipAnimation]);

  const flipCard = () => {
    if (isFlipped) {
      Animated.spring(flipAnimation, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(flipAnimation, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
    setIsFlipped(!isFlipped);
  };

  const resetCard = () => {
    flipAnimation.setValue(0);
    setIsFlipped(false);
  };

  return {
    isFlipped,
    flipCard,
    flipToFrontStyle,
    flipToBackStyle,
    resetCard,
  };
};
