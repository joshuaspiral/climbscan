import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Image, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectHold, deselectHold, saveRoute } from './redux/routesSlice';
import { useRouter } from 'expo-router';
import Svg, { Rect } from 'react-native-svg';

export default function RouteMaker() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { photoUri, detections, photoDimensions } = useSelector(state => state.detections);
  const selectedHolds = useSelector(state => state.routes.selectedHolds) || [];

  const [isSaving, setIsSaving] = useState(false);

  if (!photoDimensions) {
    return (
      <View style={styles.container}>
        <Text>No photo dimensions available</Text>
      </View>
    );
  }

  const { width: imageWidth, height: imageHeight } = photoDimensions;

  const handleSelectHold = (index: number) => {
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

      <Image 
        source={{ uri: photoUri }} 
        style={{ width: imageWidth, height: imageHeight }} 
      />

      <Svg style={StyleSheet.absoluteFill} viewBox={`0 0 ${imageWidth} ${imageHeight}`}>
        {detections.map((detection, index) => {
          const [x, y, width, height] = detection.bounding_box;
          const normalizedX = x * imageWidth;
          const normalizedY = y * imageHeight;
          const normalizedWidth = width * imageWidth;
          const normalizedHeight = height * imageHeight;

          return (
            <Rect
              key={index}
              x={normalizedX}
              y={normalizedY}
              width={normalizedWidth}
              height={normalizedHeight}
              stroke={selectedHolds.includes(index) ? "green" : "red"}
              strokeWidth="2"
              fill="none"
              onPress={() => handleSelectHold(index)}
            />
          );
        })}
      </Svg>

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