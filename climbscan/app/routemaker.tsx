import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import Svg, { Rect } from 'react-native-svg';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

// Define interface for hold detection bounding box coordinates
interface Detection {
  bounding_box: [number, number, number, number];
}

interface State {
  detections: {
    photoUri: string;
    photoDimensions: { width: number; height: number };
    detections: Detection[];
  };
}

// Define possible types of holds
type HoldType = 'intermediate' | 'start' | 'end';

export default function RouteMaker() {
  const router = useRouter();

  // Retrieve data from the Redux store
  const { photoUri, photoDimensions, detections } = useSelector(
    (state: State) => state.detections
  );

  const [containerLayout, setContainerLayout] = useState({ width: 0, height: 0 });
  
  // Hold selections with type mapping (start, intermediate, end)
  const [holdSelections, setHoldSelections] = useState<{ [key: number]: HoldType }>({});

  // Handle the layout not being available
  if (!photoDimensions || !detections) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Calculate image scaling and offset for display
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

  // Handle toggling between different hold types
  const handleSelectHold = (index: number) => {
    setHoldSelections((prev) => {
      const current = prev[index];
      if (!current) {
        return { ...prev, [index]: 'intermediate' };
      } else if (current === 'intermediate') {
        return { ...prev, [index]: 'start' };
      } else if (current === 'start') {
        return { ...prev, [index]: 'end' };
      } else if (current === 'end') {
        const newSelections = { ...prev };
        delete newSelections[index];
        return newSelections;
      }
      return prev;
    });
  };

  // Clear all selected holds
  const handleClearSelection = () => {
    setHoldSelections({});
  };

  // Save the route image
  const handleSaveRoute = async () => {
    try {
      const imageName = `${FileSystem.documentDirectory}route.png`;
      const downloadImage = await FileSystem.downloadAsync(photoUri, imageName);
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted') {
        await MediaLibrary.createAssetAsync(downloadImage.uri);
        Sharing.shareAsync(downloadImage.uri);
        alert('Route saved and ready to share!');
      }
    } catch (error) {
      alert('Error saving the route.');
    }
  };

  // Get stroke color based on the hold type
  const getStrokeColor = (holdType?: HoldType) => {
    switch (holdType) {
      case 'intermediate':
        return 'green';
      case 'start':
        return 'blue';
      case 'end':
        return 'purple';
      default:
        return 'red';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Holds for Your Route</Text>
      
      <View
        style={styles.imageContainer}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setContainerLayout({ width, height });
        }}
      >
        <Image source={{ uri: photoUri }} style={styles.image} resizeMode="contain" />
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
          {detections.map((detection: Detection, index: number) => {
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
                stroke={getStrokeColor(holdType)}
                strokeWidth="16"
                fill="rgba(0,0,0,0.01)"
                onPress={() => handleSelectHold(index)}
                pointerEvents="auto"
              />
            );
          })}
        </Svg>
      </View>
      
      {/* Buttons for user actions */}
      <Button title="Clear Selection" onPress={handleClearSelection} />
      <Button title="Save Route" onPress={handleSaveRoute} />
      <Text>Holds selected: {Object.keys(holdSelections).length}</Text>

      {/* Color-coded legend */}
      <View style={styles.legend}>
        <Text style={[styles.legendItem, { color: 'red' }]}>Red: Not Selected</Text>
        <Text style={[styles.legendItem, { color: 'green' }]}>Green: Intermediate Hold</Text>
        <Text style={[styles.legendItem, { color: 'blue' }]}>Blue: Start Hold</Text>
        <Text style={[styles.legendItem, { color: 'purple' }]}>Purple: End Hold</Text>
      </View>
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
  legend: {
    marginTop: 20,
  },
  legendItem: {
    fontSize: 16,
    marginVertical: 4,
  },
});
