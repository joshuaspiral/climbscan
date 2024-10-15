// app/camera.tsx
import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function CameraScreen() {
  const [photoUri, setPhotoUri] = useState(null);
  const router = useRouter();

  const takePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Camera permission is required');
        return;
      }

      // Launch the camera
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // You can enable editing if needed
        quality: 1, // Adjust image quality (0-1)
      });

      // Check if the user canceled the camera or if there's an error
      if (!result.canceled && result.assets) {
        setPhotoUri(result.assets[0].uri);
        // Navigate to the result screen with the photo URI
        router.push({
          pathname: '/result',
          params: { photoUri: result.assets[0].uri },
        });
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error('Unexpected error: ', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Take a photo" onPress={takePhoto} />
      {photoUri && <Image source={{ uri: photoUri }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 400,
    marginTop: 20,
  },
});
