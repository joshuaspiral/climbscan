import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function InstructionsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>How to Use ClimbScan</Text>

      <View style={styles.stepContainer}>
        <Ionicons name="camera" size={24} color="black" />
        <Text style={styles.sectionTitle}>Step 1: Take a Photo</Text>
      </View>
      <Text style={styles.text}>
        - On the home screen, press "Take a Photo of the Climbing Wall".
        - Grant camera permissions if prompted.
        - Capture a clear image of the climbing wall.
      </Text>

      <View style={styles.stepContainer}>
        <Ionicons name="image" size={24} color="black" />
        <Text style={styles.sectionTitle}>Step 2: Image Processing</Text>
      </View>
      <Text style={styles.text}>
        - The system will process the image and detect climbing holds.
        - Once detection is complete, you will be redirected to the RouteMaker screen.
      </Text>

      <View style={styles.stepContainer}>
        <Ionicons name="hand-left" size={24} color="black" />
        <Text style={styles.sectionTitle}>Step 3: Select Your Holds</Text>
      </View>
      <Text style={styles.text}>
        - Tap on detected holds to create a custom climbing route.
        - Toggle the hold once to select as an intermediate hold, twice to select as a starting hold, and three times as an ending hold.
        - Selected holds will be highlighted.
        - Press "Clear Selection" to reset.
      </Text>

      <View style={styles.stepContainer}>
        <Ionicons name="checkmark-done" size={24} color="black" />
        <Text style={styles.sectionTitle}>Step 4: View and Adjust</Text>
      </View>
      <Text style={styles.text}>
        - Once satisfied, press “save route” and start climbing!
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
    color: '#333',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  text: {
    fontSize: 16,
    marginTop: 5,
    lineHeight: 22,
    color: '#666',
  },
});
