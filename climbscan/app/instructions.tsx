import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function InstructionsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>How to Use ClimbScan</Text>

      <Text style={styles.sectionTitle}>Step 1: Take a Photo</Text>
      <Text style={styles.text}>
        - On the home screen, press "Take a Photo of the Climbing Wall".
        - Grant camera permissions if prompted.
        - Capture a clear image of the climbing wall.
      </Text>

      <Text style={styles.sectionTitle}>Step 2: Image Processing</Text>
      <Text style={styles.text}>
        - The system will process the image and detect climbing holds.
        - Once detection is complete, you will be redirected to the RouteMaker screen.
      </Text>

      <Text style={styles.sectionTitle}>Step 3: Select Your Holds</Text>
      <Text style={styles.text}>
        - Tap on detected holds to create a custom climbing route.
        - Selected holds will be highlighted.
        - Press "Clear Selection" to reset.
      </Text>

      <Text style={styles.sectionTitle}>Step 4: View and Adjust</Text>
      <Text style={styles.text}>
        - Once satisfied, save your route and start climbing!
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  text: {
    fontSize: 16,
    marginTop: 5,
    lineHeight: 22,
  },
});
