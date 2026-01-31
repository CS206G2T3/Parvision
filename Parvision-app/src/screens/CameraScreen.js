import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Video } from 'lucide-react-native';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const handleRecordingFinished = (video) => {
    // Placeholder: Add your video processing logic here in the future
    // e.g., upload to server, save to gallery, navigate to analysis screen
    console.log('video has been saved');
  };

  const toggleRecording = async () => {
    if (!cameraRef.current || !isCameraReady) return;
    if (isProcessing && !isRecording) return; // Only block if processing but not recording

    // Start recording
    if (!isRecording) {
      setIsRecording(true);
      setIsProcessing(true);
      try {
        const video = await cameraRef.current.recordAsync();
        handleRecordingFinished(video);
      } catch (error) {
        console.warn('Error while recording video:', error);
      } finally {
        setIsRecording(false);
        setIsProcessing(false);
      }
      return;
    }

    // Stop recording
    try {
      await cameraRef.current.stopRecording();
    } catch (error) {
      console.warn('Error while stopping recording:', error);
      setIsRecording(false);
      setIsProcessing(false);
    }
  };

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
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        mode="video"
        onCameraReady={() => setIsCameraReady(true)}
      />

      {/* Overlay UI with record button */}
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>
          {isCameraReady ? 'Point the camera at your swing' : 'Starting camera...'}
        </Text>
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recordButtonActive]}
          onPress={toggleRecording}
          disabled={!isCameraReady || (isProcessing && !isRecording)}
        >
          <View style={[styles.recordInner, isRecording && styles.recordInnerActive]}>
            <Video color="#fff" size={20} />
          </View>
        </TouchableOpacity>
        <Text style={styles.controlsLabel}>
          {isRecording ? 'Recording... Tap to stop' : 'Tap to record your swing'}
        </Text>
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
  recordButton: {
    marginTop: 16,
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  recordButtonActive: {
    borderColor: '#ef4444',
  },
  recordInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordInnerActive: {
    borderRadius: 8,
  },
  controlsLabel: {
    marginTop: 12,
    color: '#e5e7eb',
    fontSize: 14,
  },
});


