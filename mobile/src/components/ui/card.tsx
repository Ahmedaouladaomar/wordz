import { Card as TamaguiCard, styled } from "tamagui";

export const Card = styled(TamaguiCard, {
  name: "WordzCard",
  bordered: false,
  br: "$12",
  bw: 0.5,
  borderColor: "whitesmoke",
  bg: "white",
  elevate: true,
  shadowColor: "$brandPrimaryDark",
  shadowOpacity: 0.1,
  shadowRadius: 2,

  animation: "bouncy",
  pressStyle: {
    elevate: false,
  },
});
