import * as ExpoImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Button, Image, YStack } from "tamagui";

interface ImagePickerProps {
  onImageSelected: (uri: string) => void;
}

export const ImagePicker = ({ onImageSelected }: ImagePickerProps) => {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // Request permissions (essential for mobile)
    const permissionResult =
      await ExpoImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // Launch the picker
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setImage(selectedUri);
      onImageSelected(selectedUri);
    }
  };

  return (
    <YStack gap="$3" ai="center">
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 200, height: 200, borderRadius: 10 }}
        />
      )}
      <Button onPress={pickImage}>
        {image ? "Change Image" : "Pick an image"}
      </Button>
    </YStack>
  );
};
