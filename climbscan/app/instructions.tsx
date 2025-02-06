import React, { useState, useEffect, useRef } from 'react';
import { View, Button, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';

export default function InstructionsScreen() {

  return (
    <View style={styles.container}>
      <h1>hello</h1>
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
    marginTop: 20,
  },
});
