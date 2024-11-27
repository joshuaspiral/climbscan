import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectHold, removeHold, saveRoute } from './redux/routesSlice';
import { useRouter } from 'expo-router';

export default function RouteMaker() {
  const router = useRouter();
  const dispatch = useDispatch();

  const detections = useSelector(state => state.detections.detections);
  const selectedHolds = useSelector(state => state.routes.selectedHolds);

  const [isSaving, setIsSaving] = useState(false);

  const handleSelectHold = (holdId: string) => {
    if (selectedHolds.includes(holdId)) {
      dispatch(removeHold(holdId)); 
    } else {
      dispatch(selectHold(holdId)); 
    }
  };

  const handleSaveRoute = () => {
    if (selectedHolds.length === 0) {
      Alert.alert('Error', 'Please select at least one hold to create a route');
      return;
    }

    setIsSaving(true);
    dispatch(saveRoute());
    Alert.alert('Success', 'Route saved!');
    setIsSaving(false);
    router.push('/routes'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Route</Text>

      <View style={styles.holdsContainer}>
        {detections.map((hold, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.holdButton,
              selectedHolds.includes(hold.id) && styles.selectedHold,
            ]}
            onPress={() => handleSelectHold(hold.id)}
          >
            <Text style={styles.holdText}>Hold {index + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Save Route" onPress={handleSaveRoute} disabled={isSaving} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  holdsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  holdButton: {
    backgroundColor: '#DDD',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  selectedHold: {
    backgroundColor: '#4CAF50',
  },
  holdText: {
    color: '#000',
  },
});

