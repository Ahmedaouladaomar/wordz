import { defaultConfig, tokens as defaultTokens } from "@tamagui/config/v5";
import { shorthands } from "@tamagui/shorthands";
import { createFont, createTamagui, createTokens } from "tamagui";

const customColors = {
  brandPrimary: "#006572",
  brandPrimaryLight: "#E1FBFF",
  brandPrimaryDark: "#00434d",
} as const;

const customSizes = {
  xs: 12,
  sm: 14,
  md: 18,
  lg: 22,
} as const;

const tokens = createTokens({
  ...defaultTokens,
  color: {
    ...defaultTokens.color,
    ...customColors,
  },
  size: {
    ...defaultTokens.size,
    ...customSizes,
  },
  radius: defaultTokens.radius,
  zIndex: defaultTokens.zIndex,
  space: defaultTokens.space,
});

const mainFont = createFont({
  family: "System",
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 22,
    6: 30,
    // Map descriptive tokens
    ...customSizes,
  },
  lineHeight: {
    1: 15,
    2: 18,
    // ...
  },
  weight: {
    4: "300",
    6: "600",
    9: "900",
  },
  letterSpacing: {
    4: 0,
    9: 2,
  },
});

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  shorthands,
  tokens,
  fonts: {
    heading: mainFont,
    body: mainFont,
  },
  themes: {
    light: {
      background: tokens.color.brandPrimaryLight,
    },
    dark: {
      background: tokens.color.brandPrimaryDark,
    },
  },
});

export type AppConfig = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConfig {}
}
