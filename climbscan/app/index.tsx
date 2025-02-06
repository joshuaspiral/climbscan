import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ClimbScan</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/camera')}>
        <Text style={styles.buttonText}>Take a Photo of the Climbing Wall</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/instructions')}>
        <Text style={styles.buttonText}>Click here for instructions!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',  // Light background color for better contrast
  },
  title: {
    fontSize: 28,  // Slightly larger title
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',  // Darker color for readability
  },
  button: {
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    marginVertical: 10,  // Space between buttons
    alignItems: 'center',  // Center text in button
  },
  buttonText: {
    color: '#FFFFFF',  // White text for contrast
    fontSize: 18,
    fontWeight: 'bold',
  },
});