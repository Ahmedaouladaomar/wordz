import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { styled, YStack } from "tamagui";

export const SkeletonBase = styled(YStack, {
  name: "Skeleton",
  bc: "lightgray",
  o: 0.8,
  variants: {
    variant: {
      circle: { br: "$true" },
      rect: { br: "$2" },
    },
  } as const,

  defaultVariants: {
    variant: "rect",
  },
});

export function SkeletonPulse({ children }: { children: React.ReactNode }) {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );

    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <Animated.View style={{ opacity: pulseAnim, width: "100%" }}>
      {children}
    </Animated.View>
  );
}

export const Skeleton = Object.assign(SkeletonBase, {
  Pulse: SkeletonPulse,
});
