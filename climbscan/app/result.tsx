import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import Svg, { Rect } from 'react-native-svg';

const ResultScreen = () => {
  const { photoUri, photoDimensions, detections } = useSelector((state) => state.detections);
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  if (!photoDimensions) {
    return (
      <View style={styles.container}>
        <Text>No photo dimensions available</Text>
      </View>
    );
  }

  const { width: imageWidth, height: imageHeight } = photoDimensions;

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const windowAspectRatio = windowWidth / windowHeight;
  const imageAspectRatio = imageWidth / imageHeight;

  let displayWidth, displayHeight, paddingX, paddingY;

  console.log("Display Dimensions:", windowWidth, windowHeight);
  if (imageAspectRatio > windowAspectRatio) {
    // Image is wider than the container, fit by width
    paddingX = 0;
    paddingY = (windowHeight - imageHeight) / 2; // Center vertically
  } else {
    // Image is taller than the container, fit by height
    paddingY = 0;
    console.log(windowWidth, imageWidth);
    
    paddingX = (windowWidth - imageWidth) / 2; // Center horizontally
  }

  console.log("Padding:", paddingX, paddingY);

  return (
    <View style={styles.container}>
      <View onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setLayout({ width, height });
      }} style={styles.imageContainer}>
        <Image 
          source={{ uri: photoUri }} 
          style={styles.image} 
          resizeMode="contain"
        />
        <Svg style={StyleSheet.absoluteFill} viewBox={`0 0 ${windowWidth} ${windowHeight}`}>
          {detections.map((detection, index) => {
            const [x_center, y_center, width, height] = detection.bounding_box;

            // Scale YOLO coordinates to displayed dimensions
            const rectX = paddingX + (x_center - width / 2) * displayWidth; // Convert x_center to top-left x
            const rectY = paddingY + (y_center - height / 2) * displayHeight; // Convert y_center to top-left y
            const rectWidth = width * displayWidth; // Scale width
            const rectHeight = height * displayHeight; // Scale height
            console.log(`Bounding Box ${index}:`, rectX, rectY, rectWidth, rectHeight);

            return (
              <Rect
                key={index}
                x={rectX}
                y={rectY}
                width={rectWidth}
                height={rectHeight}
                stroke="red"
                strokeWidth="2"
                fill="none"
              />
            );
          })}
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ResultScreen;
