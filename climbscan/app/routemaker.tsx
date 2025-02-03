import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Image, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectHold, deselectHold, saveRoute } from './redux/routesSlice';
import { useRouter } from 'expo-router';
import Svg, { Rect } from 'react-native-svg';

const PLACEHOLDER_PHOTO_URI = 'https://placehold.co/600x400'; 
const PLACEHOLDER_DETECTIONS = [
  { bounding_box: [0.2, 0.3, 0.4, 0.5] },
  { bounding_box: [0.5, 0.2, 0.7, 0.4] },
  { bounding_box: [0.3, 0.6, 0.5, 0.8] },
];
const PLACEHOLDER_PHOTO_DIMENSIONS = { width: 300, height: 400 };

export default function RouteMaker() {
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedHolds = useSelector(state => state.routes.selectedHolds) || [];

  const [isSaving, setIsSaving] = useState(false);

  // Use placeholder data instead of Redux state
  const photoUri = PLACEHOLDER_PHOTO_URI;
  const detections = PLACEHOLDER_DETECTIONS;
  const photoDimensions = PLACEHOLDER_PHOTO_DIMENSIONS;

  const handleSelectHold = (index: number) => {
    console.log(index, selectedHolds);
    
    if (selectedHolds.includes(index)) {
      dispatch(deselectHold(index));
    } else {
      dispatch(selectHold(index));
    }
  };

  const handleSaveRoute = () => {
    if (selectedHolds.length === 0) {
      Alert.alert('Error', 'Please select at least one hold to create a route');
      return;
    }

    setIsSaving(true);
    dispatch(saveRoute());
    Alert.alert('Success', 'Route saved!');
    setIsSaving(false);
    router.push('/routes');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Route</Text>

      <View style={{ position: 'relative' }}>
        <Image 
          source={{ uri: photoUri }} 
          style={{ width: photoDimensions.width, height: photoDimensions.height }} 
        />

        <Svg 
          style={[
            StyleSheet.absoluteFill, 
            { 
              width: photoDimensions.width, 
              height: photoDimensions.height,
              zIndex: 1 // Ensure SVG is above the image
            }
          ]}
          pointerEvents="box-none" // Allow touches to pass through
        >
          {detections.map((detection, index) => {
            const [x, y, width, height] = detection.bounding_box;
            const normalizedX = x * photoDimensions.width;
            const normalizedY = y * photoDimensions.height;
            const normalizedWidth = width * photoDimensions.width;
            const normalizedHeight = height * photoDimensions.height;

            return (
              <Rect
                key={index}
                x={normalizedX}
                y={normalizedY}
                width={normalizedWidth}
                height={normalizedHeight}
                stroke={selectedHolds.includes(index) ? "green" : "red"}
                strokeWidth="2"
                fill="rgba(0,0,0,0.01)" // Nearly transparent but tappable
                onPress={() => handleSelectHold(index)}
                pointerEvents="auto" // Explicitly enable pointer events
                hitSlop={{ // to extend clickable area
                  top: 10,
                  bottom: 10,
                  left: 10,
                  right: 10
                }}
              />
            );
          })}
        </Svg>
      </View>

      <Button title="Save Route" onPress={handleSaveRoute} disabled={isSaving} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});