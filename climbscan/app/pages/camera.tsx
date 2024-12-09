import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setDetections } from '../redux/detectionsSlice';

export default function CameraScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const isMounted = useRef(true);

  // Cleanup to set the ref to false when the component is unmounted
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Camera permission is required');
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        const photoUri = result.assets[0].uri;
        setPhotoUri(photoUri);
        await uploadImage(photoUri);
      }
    } catch (error) {
      console.error('Unexpected error: ', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const uploadImage = async (uri: string) => {
    setLoading(true);
    const formData = new FormData();

    try {
      const base64Data = uri.split(',')[1]; // If URI is base64
      const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then((res) => res.blob());
      formData.append('image', blob, 'photo.jpg');

      const response = await fetch('http://localhost:5000/detect', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      const result = await response.json();
      // Dispatch only if the component is still mounted
      if (isMounted.current) {
        dispatch(setDetections(result.detections)); 
      }
      // Navigate only if the component is still mounted
      if (isMounted.current) {
        router.push({
          pathname: '/result',
          params: { photoUri: uri },
        });
      }
    } catch (error) {
      console.error('Error uploading image: ', error);
      Alert.alert('Error', 'Failed to upload the image');
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Take a photo" onPress={takePhoto} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
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

