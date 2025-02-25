import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Button, Image, findNodeHandle } from 'react-native';
import { useSelector } from 'react-redux';
import Svg, { Rect } from 'react-native-svg';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';

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
  const { photoUri, photoDimensions, detections } = useSelector(
    (state: State) => state.detections
  );
  const [containerLayout, setContainerLayout] = useState({ width: 0, height: 0 });
  const [holdSelections, setHoldSelections] = useState<{ [key: number]: HoldType }>({});

  // Use a dedicated ref for the image container
  const imageContainerRef = useRef<View>(null);

  if (!photoDimensions || !detections) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Calculate scaling for displaying the image
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

  // Toggle hold selection state
  const handleSelectHold = (index: number) => {
    setHoldSelections((prev) => {
      const current = prev[index];
      if (!current) return { ...prev, [index]: 'intermediate' };
      if (current === 'intermediate') return { ...prev, [index]: 'start' };
      if (current === 'start') return { ...prev, [index]: 'end' };
      if (current === 'end') {
        const newSelections = { ...prev };
        delete newSelections[index];
        return newSelections;
      }
      return prev;
    });
  };

  const handleClearSelection = () => {
    setHoldSelections({});
  };

  // Capture and share the image container view
  const handleShareRoute = async () => {
    try {
      if (!imageContainerRef.current) {
        alert("Error: The view isn't ready for capture.");
        return;
      }
      // Small delay to ensure the view has rendered fully
      await new Promise((resolve) => setTimeout(resolve, 500));

      const uri = await captureRef(imageContainerRef.current, {
        format: 'png',
        quality: 1,
      });
      await Sharing.shareAsync(uri);
      alert('Route captured and shared successfully!');
    } catch (error) {
      console.error("Error during capture and share:", error);
      alert("Error sharing the route: " + error);
    }
  };

  // Determine stroke colour based on the hold type
  const getStrokeColour = (holdType?: HoldType) => {
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
    <View style={styles.outerContainer}>
      <Text style={styles.title}>Select Holds for Your Route</Text>
      
      {/* Attach the ref here on the image container */}
      <View
        ref={imageContainerRef}
        collapsable={false}
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
                stroke={getStrokeColour(holdType)}
                strokeWidth="16"
                fill="rgba(0,0,0,0.01)"
                onPress={() => handleSelectHold(index)}
                pointerEvents="auto"
              />
            );
          })}
        </Svg>
      </View>
      
      <Button title="Clear Selection" onPress={handleClearSelection} />
      <Button title="Share Route" onPress={handleShareRoute} />
      <Text>Holds selected: {Object.keys(holdSelections).length}</Text>

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
  outerContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
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
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 400,
    position: 'relative',
    marginBottom: 20,
    backgroundColor: '#F5F5F5',
    overflow: 'visible',
  },
  image: {
    flex: 1,
    borderRadius: 10,
  },
  legend: {
    marginTop: 20,
    alignItems: 'center',
  },
  legendItem: {
    fontSize: 16,
    marginVertical: 4,
  },
});
