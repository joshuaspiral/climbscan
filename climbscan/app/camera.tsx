import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { setPhotoUri, setPhotoDimensions, setDetections } from './redux/detectionsSlice';

export default function CameraScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [photoUri, setPhotoUriState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Camera permissions are required to take a photo');
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0,
      });

      if (!result.canceled && result.assets) {
        const uri = result.assets[0].uri;
        const { width, height } = result.assets[0];
        setPhotoUriState(uri);
        dispatch(setPhotoUri(uri));
        dispatch(setPhotoDimensions({ width, height }));

        const formData = new FormData();
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append('image', blob, 'photo.jpg');

        const apiResponse = await fetch('http://localhost:5000/detect', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
        });

        const data = await apiResponse.json();
        dispatch(setDetections(data.detections));
        navigation.navigate('routemaker');
      }
    } catch (error) {
      console.error('Unexpected error: ', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>Take a Photo</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#007BFF" />}
      {photoUri && <Image source={{ uri: photoUri }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5', 
  },
  button: {
    backgroundColor: '#007BFF',  // Primary color for buttons
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',  // White text for contrast
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',  // Full width image
    height: undefined,
    aspectRatio: 3 / 4,  // Maintain aspect ratio
    borderRadius: 10,
    marginTop: 20,
  },
});