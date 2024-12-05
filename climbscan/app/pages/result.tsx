import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text } from 'react-native-svg';
import { useSearchParams } from 'expo-router';

const ResultScreen = () => {
  const { photoUri, detections } = useSearchParams();
  const parsedDetections = JSON.parse(detections); // Convert string to array
  const screenWidth = Dimensions.get('window').width;

  // Adjust the height and width to match the image aspect ratio?
  const imageAspectRatio = 3 / 4; // Assuming a standard photo aspect ratio
  const imageWidth = screenWidth;
  const imageHeight = screenWidth * imageAspectRatio;

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={{ width: imageWidth, height: imageHeight }} />
      
      <Svg style={StyleSheet.absoluteFill} viewBox={`0 0 ${imageWidth} ${imageHeight}`}>
        {parsedDetections.map((detection, index) => {
          const [x, y, width, height] = detection.bounding_box; // Coordinates from detection
          const normalizedX = x * imageWidth;
          const normalizedY = y * imageHeight;
          const normalizedWidth = width * imageWidth;
          const normalizedHeight = height * imageHeight;

          return (
            <React.Fragment key={index}>
              <Rect
                x={normalizedX}
                y={normalizedY}
                width={normalizedWidth}
                height={normalizedHeight}
                stroke="red"
                strokeWidth="2"
                fill="none"
              />
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ResultScreen;

