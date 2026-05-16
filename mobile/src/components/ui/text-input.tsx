import { Eye, EyeOff } from "@tamagui/lucide-icons"; // Assuming you use lucide-icons
import React, { forwardRef, useState } from "react";
import {
  Button,
  Input,
  Label,
  TamaguiElement,
  XStack,
  YStack,
  styled,
} from "tamagui";

const StyledInput = styled(Input, {
  name: "TextInput",
  br: "$6",
  bw: 0,
  h: 60,
  px: "$5",
  fos: "$md",
  flex: 1,
});

export const TextInput = forwardRef<TamaguiElement, any>(
  ({ label, placeholder, secureTextEntry, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = secureTextEntry;
    const isSecure = isPassword && !showPassword;

    return (
      <YStack gap="$2" w="100%">
        <Label
          fos="$3"
          fow="700"
          ls={2}
          color="$brandPrimary"
          tt="uppercase"
          pl="$1"
        >
          {label}
        </Label>

        <XStack pos="relative" jc="center" ai="center">
          <StyledInput
            p={20}
            placeholder={placeholder}
            placeholderTextColor="#4786"
            {...props}
            secureTextEntry={isSecure}
            ref={ref}
            pr={isPassword ? "$10" : "$5"}
          />

          {isPassword && (
            <Button
              color="rgba(68, 119, 136, 0.57)"
              bg="transparent"
              position="absolute"
              top={0}
              right={0}
              borderWidth={0}
              height={60}
              pressStyle={{ bg: "transparent", opacity: 0.5 }}
              onPress={() => setShowPassword(!showPassword)}
              icon={showPassword ? <EyeOff size="$1" /> : <Eye size="$1" />}
            />
          )}
        </XStack>
      </YStack>
    );
  },
);

TextInput.displayName = "TextInput";
