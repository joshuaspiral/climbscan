import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { Provider } from 'react-redux';
import store from './redux/store'; 

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Provider store={store}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to ClimbScan</Text>
        <Button
          title = "Take a Photo of the Climbing Wall"
          onPress={() => router.push('/camera')} 
        />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

