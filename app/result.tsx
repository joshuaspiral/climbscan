// app/result.tsx
import React from 'react';
import { View, Image, StyleSheet, Button, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ResultScreen() {
  const router = useRouter();
  const { photoUri } = useLocalSearchParams();

  if (!photoUri) {
    Alert.alert('Error', 'No photo to display');
    return null;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri as string }} style={styles.image} />
      <Button title="Let ClimbScan do its thang" onPress={() => router.push('/scan')} />
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 400,
    marginBottom: 20,
  },
});
