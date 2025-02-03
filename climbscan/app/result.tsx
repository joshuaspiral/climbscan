import React, { useState } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import Svg, { Rect } from 'react-native-svg';

interface Detection {
  bounding_box: [number, number, number, number]; // x, y, width, height normalised between 0-1
}

interface State {
  detections: {
    photoUri: string;
    photoDimensions: { width: number; height: number };
    detections: Detection[];
  };
}

const ResultScreen = () => {
  const { photoUri, photoDimensions, detections } = useSelector((state: State) => state.detections);
  const [containerLayout, setContainerLayout] = useState({
    width: 0,
    height: 0,
  });

  if (!photoDimensions || !detections) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

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

  return (
    <View style={styles.container}>
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

        // position like image
        <Svg 
          style={{
            position: 'absolute',
            left: offsetX,
            top: offsetY,
            width: displayedWidth,
            height: displayedHeight,
          }}
          viewBox={`0 0 ${photoDimensions.width} ${photoDimensions.height}`}
        >
          {detections.map((detection: Detection, index: number) => {
            const [normX, normY, normWidth, normHeight] = detection.bounding_box;
            
            const x = normX * photoDimensions.width;
            const y = normY * photoDimensions.height;
            const width = normWidth * photoDimensions.width;
            const height = normHeight * photoDimensions.height;

            return (
              <Rect
                key={index}
                x={x}
                y={y}
                width={width}
                height={height}
                stroke="red"
                strokeWidth="2"
                fill="none"
              />
            );
          })}

          <Rect
            x={0}
            y={0}
            width={photoDimensions.width}
            height={photoDimensions.height}
            stroke="blue"
            strokeWidth="2"
            fill="none"
          />
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
    position: 'relative',
  },
  image: {
    flex: 1,
  },
});

export default ResultScreen;
