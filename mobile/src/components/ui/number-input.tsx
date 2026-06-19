import { Minus, Plus } from "@tamagui/lucide-icons";
import React from "react";
import { Button, Input, SizeTokens, XStack } from "tamagui";

interface Props {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  allowDecimals?: boolean;
  size?: SizeTokens;
  showPlusIcon?: boolean;
  showMinusIcon?: boolean;
  style?: any;
}

export const NumberInput = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  allowDecimals = false,
  size = "$4",
  showPlusIcon = false,
  showMinusIcon = false,
  style = {},
}: Props) => {
  const updateValue = (newValue: number) => {
    let sanitized = newValue;
    if (sanitized < min) sanitized = min;
    if (sanitized > max) sanitized = max;

    if (allowDecimals) {
      sanitized = parseFloat(sanitized.toFixed(2));
    }

    onChange(sanitized);
  };

  const handleIncrement = () => updateValue(value + step);
  const handleDecrement = () => updateValue(value - step);

  const handleTextChange = (text: string) => {
    if (text === "") {
      onChange(min);
      return;
    }

    // Strip bad characters depending on decimal flag
    const regex = allowDecimals ? /[^0-9.]/g : /[^0-9]/g;
    let cleanText = text.replace(regex, "");

    // Stop multiple decimals if typed
    if (allowDecimals && (cleanText.match(/\./g) || []).length > 1) {
      return;
    }

    const parsed = allowDecimals
      ? parseFloat(cleanText)
      : parseInt(cleanText, 10);

    if (!isNaN(parsed)) {
      updateValue(parsed);
    }
  };

  return (
    <XStack ai="center" overflowX="hidden" overflowY="hidden" style={style}>
      {/* Minus Button */}
      {showMinusIcon && (
        <Button
          size={size}
          onPress={handleDecrement}
          disabled={value <= min}
          chromeless
          icon={Minus}
          px="$3"
        />
      )}

      {/* Number Input Field */}
      <Input
        value={String(value)}
        onChangeText={handleTextChange}
        keyboardType={allowDecimals ? "decimal-pad" : "number-pad"}
        ta="center"
        w={70}
        size={size}
        bw={0}
        bc="transparent"
        focusStyle={{ bw: 0, outlineWidth: 0 }}
      />

      {/* Plus Button */}
      {showPlusIcon && (
        <Button
          size={size}
          onPress={handleIncrement}
          disabled={value >= max}
          chromeless
          icon={Plus}
          px="$3"
        />
      )}
    </XStack>
  );
};
