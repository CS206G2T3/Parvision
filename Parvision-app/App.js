import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isTfReady, setIsTfReady] = useState(false);

  useEffect(() => {
    async function initTensorFlow() {
      try {
        // Wait for TensorFlow.js to be ready
        await tf.ready();
        console.log('TensorFlow.js initialized with backend:', tf.getBackend());
        setIsTfReady(true);
      } catch (error) {
        console.error('Error initializing TensorFlow.js:', error);
        // Still set ready to true so app can function (pose detection just won't work)
        setIsTfReady(true);
      }
    }

    initTensorFlow();
  }, []);

  // Show loading screen while TensorFlow initializes
  if (!isTfReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Initializing AI...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{ title: 'Record Swing' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    marginTop: 16,
    color: '#fff',
    fontSize: 16,
  },
});
