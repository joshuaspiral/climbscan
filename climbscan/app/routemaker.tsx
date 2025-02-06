import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Image } from 'react-native';
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
  const [containerLayout, setContainerLayout] = useState({ width: 0, height: 0 });
  const [isSaving, setIsSaving] = useState(false);

  const { photoUri, photoDimensions, detections } = useSelector((state: State) => state.detections);

  if (!photoDimensions || !detections) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  // Calculate image display dimensions
  const containerAspect = containerLayout.width / containerLayout.height;
  const imageAspect = photoDimensions.width / photoDimensions.height;
  
  let displayedWidth = containerLayout.width;
  let displayedHeight = containerLayout.height;
  let offsetX = 0;
  let offsetY = 0;

  if (imageAspect > containerAspect) {
    displayedHeight = containerLayout.width / imageAspect;
    offsetY = (containerLayout.height - displayedHeight) / 2;
  } else {
    displayedWidth = containerLayout.height * imageAspect;
    offsetX = (containerLayout.width - displayedWidth) / 2;
  }

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

      <View 
        style={styles.imageContainer}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setContainerLayout({ width, height });
        }}
      >
        <Image
          source={{ uri: photoUri }}
          style={styles.image}
          resizeMode="contain"
        />

        <Svg 
          style={{
            position: 'absolute',
            left: offsetX,
            top: offsetY,
            width: displayedWidth,
            height: displayedHeight,
          }}
          viewBox={`0 0 ${photoDimensions.width} ${photoDimensions.height}`}
          pointerEvents="box-none"
        >
          {detections.map((detection, index) => {
            const [normX, normY, normWidth, normHeight] = detection.bounding_box;
            const x = normX * photoDimensions.width;
            const y = normY * photoDimensions.height;
            const width = normWidth * photoDimensions.width;
            const height = normHeight * photoDimensions.height;

            return (
              <Rect
                key={index}
                x={x - width/2}
                y={y - height/2}
                width={width}
                height={height}
                stroke={selectedHolds.includes(index) ? "green" : "red"}
                strokeWidth="16"
                fill="rgba(0,0,0,0.01)"
                onPress={() => handleSelectHold(index)}
                pointerEvents="auto"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
  imageContainer: {
    width: '100%',
    height: 400, // Adjust as needed
    position: 'relative',
    marginBottom: 20,
  },
  image: {
    flex: 1,
  },
});