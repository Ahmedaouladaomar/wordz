// app/components/icons/AppLogo.tsx
import React from "react";
// Import native SVG primitives from your Expo runtime
import Svg, { Rect, SvgProps } from "react-native-svg";

export default function AppLogo({
  width = 35,
  height = 35,
  ...props
}: SvgProps) {
  // Fallbacks maintain your design layout even if theme config loads late
  const primaryColor = "#006572";
  const accentColor = "#008798";

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 118 104"
      fill="none"
      {...props}
    >
      {/* Outer Pillars */}
      <Rect width="24" height="104" rx="12" fill={primaryColor} />
      <Rect x="94" width="24" height="104" rx="12" fill={primaryColor} />

      {/* Inner Steps */}
      <Rect x="31" y="41" width="24" height="63" rx="12" fill={accentColor} />
      <Rect x="63" y="41" width="24" height="63" rx="12" fill={accentColor} />
    </Svg>
  );
}
