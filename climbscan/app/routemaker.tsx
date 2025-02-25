import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Button, Image, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import Svg, { Rect } from 'react-native-svg';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';

export default function RouteMaker() {
  const router = useRouter();

  // Retrieve data from Redux store
  const { photoUri, photoDimensions, detections } = useSelector((state) => state.detections);
  const [containerLayout, setContainerLayout] = useState({ width: 0, height: 0 });
  const [holdSelections, setHoldSelections] = useState({});

  // Reference for capturing the view
  const captureViewRef = useRef<View>(null);

  const handleSaveRoute = async () => {
    try {
      if (!captureViewRef.current) {
        Alert.alert("Error", "View not ready for capture. Try again.");
        return;
      }
  
      const uri = await captureRef(captureViewRef.current, {
        format: 'png',
        quality: 1,
      });
  
      // Request permission to save to gallery
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Media Library access is required to save the route.");
        return;
      }
  
      // Save and share the image
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('ClimbRoutes', asset, false);
      await Sharing.shareAsync(uri);
  
      Alert.alert("Success", "Route saved and ready to share!");
    } catch (error) {
      console.error("Error saving route:", error);
      Alert.alert("Error", "Failed to save the route.");
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Holds for Your Route</Text>

      <View
        ref={captureViewRef} // Ref for capturing
        style={styles.imageContainer}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setContainerLayout({ width, height });
        }}
      >
        <Image source={{ uri: photoUri }} style={styles.image} resizeMode="contain" />
        <Svg
          style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}
          viewBox={`0 0 ${photoDimensions.width} ${photoDimensions.height}`}
          pointerEvents="box-none"
        >
          {detections.map((detection, index) => {
            const [normX, normY, normWidth, normHeight] = detection.bounding_box;
            const x = normX * photoDimensions.width;
            const y = normY * photoDimensions.height;
            const width = normWidth * photoDimensions.width;
            const height = normHeight * photoDimensions.height;
            const holdType = holdSelections[index];

            return (
              <Rect
                key={index}
                x={x - width / 2}
                y={y - height / 2}
                width={width}
                height={height}
                stroke={'red'}
                strokeWidth="16"
                fill="rgba(0,0,0,0.01)"
              />
            );
          })}
        </Svg>
      </View>

      <Button title="Save Route" onPress={handleSaveRoute} />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  imageContainer: {
    width: '100%',
    height: 400,
    position: 'relative',
    marginBottom: 20,
  },
  image: {
    flex: 1,
    borderRadius: 10,
  },
});

