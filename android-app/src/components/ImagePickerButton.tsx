import React from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { ImageAsset } from '../types';

interface Props {
  label: string;
  onPicked: (asset: ImageAsset) => void;
  variant?: 'primary' | 'secondary';
}

async function pickFrom(source: 'camera' | 'library'): Promise<ImageAsset | null> {
  const permission =
    source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    Alert.alert('Permission needed', 'Please grant permission to continue.');
    return null;
  }

  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    base64: true,
    quality: 0.7,
  };

  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);

  if (result.canceled || !result.assets?.[0]?.base64) {
    return null;
  }

  const asset = result.assets[0];
  const mimeType = asset.mimeType ?? 'image/jpeg';
  return { uri: asset.uri, base64: asset.base64!, mimeType };
}

export default function ImagePickerButton({ label, onPicked, variant = 'primary' }: Props) {
  const handlePress = () => {
    Alert.alert('Select Image', undefined, [
      {
        text: 'Take Photo',
        onPress: async () => {
          const asset = await pickFrom('camera');
          if (asset) onPicked(asset);
        },
      },
      {
        text: 'Choose from Library',
        onPress: async () => {
          const asset = await pickFrom('library');
          if (asset) onPicked(asset);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <Pressable
      style={[styles.button, variant === 'secondary' && styles.secondaryButton]}
      onPress={handlePress}
    >
      <Text style={[styles.text, variant === 'secondary' && styles.secondaryText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#1f2430',
    borderWidth: 1,
    borderColor: '#2c3242',
  },
  text: { color: '#fff', fontWeight: '600', fontSize: 15 },
  secondaryText: { color: '#d1d5db' },
});
