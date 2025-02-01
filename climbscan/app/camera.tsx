import React, { useState, useEffect, useRef } from 'react';
import { View, Button, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
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
      console.log('gonna take now')

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

        // Call the API with the photo URI
        console.log( 'calling now');
        
        const formData = new FormData();
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append('image', blob, 'photo.jpg');
        console.log( 'created form data now goO!!');

        const apiResponse = await fetch('http://192.168.1.12:5000/detect', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
        });
        

        const data = await apiResponse.json();
        console.log('data', data.detections);
        dispatch(setDetections(data.detections));
        navigation.navigate('result');
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