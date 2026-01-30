import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  // Permission object not loaded yet
  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.message}>Checking camera permissions...</Text>
      </View>
    );
  }

  // Permission not granted yet – ask user
  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>We need access to your camera</Text>
        <Text style={styles.message}>
          {Platform.OS === 'web'
            ? 'Your browser will prompt you to allow access to the camera.'
            : 'Your device will prompt you to allow access to the camera.'}
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Allow Camera Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Permission granted – show live camera preview
  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
      />

      {/* Simple overlay UI */}
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>Point the camera at your swing</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#d1d5db',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#16a34a',
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
});


