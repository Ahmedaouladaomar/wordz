import React, { useEffect } from "react";
import Animated, {
  Easing as easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Svg, Circle as SvgCircle } from "react-native-svg";
import { YStack } from "tamagui";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export const ScreenLoader = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 800,
        easing: easing.linear,
      }),
      -1,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <YStack f={1} ai="center" jc="center" gap="$medium" bg="$background">
      <AnimatedSvg
        width="60"
        height="60"
        viewBox="0 0 50 50"
        style={animatedStyle}
      >
        {/* Background Track */}
        <SvgCircle
          cx="25"
          cy="25"
          r="20"
          stroke="#e6e6e6"
          strokeWidth="4"
          fill="none"
          strokeOpacity={0.2}
        />
        {/* Animated Primary Teal Dash */}
        <SvgCircle
          cx="25"
          cy="25"
          r="20"
          stroke="#006572" // Your brandPrimary hex
          strokeWidth="4"
          fill="none"
          strokeDasharray="90, 150"
          strokeLinecap="round"
        />
      </AnimatedSvg>
    </YStack>
  );
};
