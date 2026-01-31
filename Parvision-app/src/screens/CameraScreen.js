import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Video } from 'lucide-react-native';
import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';
import { usePoseDetection } from '../hooks/usePoseDetection';
import { SkeletonOverlay } from '../components/SkeletonOverlay';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Frame capture settings
const FRAME_INTERVAL_MS = 150; // Capture frame every 150ms (~6-7 FPS for pose detection)

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [frameDimensions, setFrameDimensions] = useState({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT });

  // Pose detection hook
  const { isModelReady, isLoading, keypoints, detectPose, clearKeypoints } = usePoseDetection();

  // Ref for frame capture interval
  const frameIntervalRef = useRef(null);
  const isCapturingRef = useRef(false);

  // Process a single frame for pose detection
  const processFrame = useCallback(async () => {
    if (!cameraRef.current || !isModelReady || isCapturingRef.current) {
      return;
    }

    isCapturingRef.current = true;

    try {
      // Capture a frame from the camera
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        skipProcessing: true,
        base64: false,
      });

      if (photo && photo.uri) {
        // Store frame dimensions for skeleton scaling
        setFrameDimensions({ width: photo.width, height: photo.height });

        // Read the image file as base64
        const imgB64 = await FileSystem.readAsStringAsync(photo.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Convert to Uint8Array
        const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
        const rawImageData = new Uint8Array(imgBuffer);

        // Decode JPEG to tensor
        const imageTensor = decodeJpeg(rawImageData);

        // Run pose detection
        await detectPose(imageTensor);

        // Dispose tensor to free memory
        tf.dispose(imageTensor);

        // Clean up the temporary photo file
        try {
          await FileSystem.deleteAsync(photo.uri, { idempotent: true });
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    } catch (error) {
      console.warn('Error processing frame:', error);
    } finally {
      isCapturingRef.current = false;
    }
  }, [isModelReady, detectPose]);

  // Start/stop frame processing when recording state changes
  useEffect(() => {
    if (isRecording && isModelReady && isCameraReady) {
      // Start frame processing loop
      console.log('Starting pose detection...');
      frameIntervalRef.current = setInterval(processFrame, FRAME_INTERVAL_MS);
    } else {
      // Stop frame processing
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
        frameIntervalRef.current = null;
      }

      // Clear keypoints when not recording
      if (!isRecording) {
        clearKeypoints();
      }
    }

    return () => {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
        frameIntervalRef.current = null;
      }
    };
  }, [isRecording, isModelReady, isCameraReady, processFrame, clearKeypoints]);

  const handleRecordingFinished = (video) => {
    // Placeholder: Add your video processing logic here in the future
    console.log('video has been saved');
  };

  const toggleRecording = async () => {
    if (!cameraRef.current || !isCameraReady) return;
    if (isProcessing && !isRecording) return;

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

  // Get status text based on model loading state
  const getStatusText = () => {
    if (!isCameraReady) return 'Starting camera...';
    if (isLoading) return 'Loading AI model...';
    if (!isModelReady) return 'AI model not ready';
    return 'Point the camera at your swing';
  };

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

      {/* Skeleton overlay - only shown when recording and keypoints detected */}
      {isRecording && (
        <SkeletonOverlay
          keypoints={keypoints}
          imageWidth={frameDimensions.width}
          imageHeight={frameDimensions.height}
        />
      )}

      {/* Model loading indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#16a34a" />
          <Text style={styles.loadingText}>Loading pose detection...</Text>
        </View>
      )}

      {/* Overlay UI with record button */}
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>{getStatusText()}</Text>
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recordButtonActive]}
          onPress={toggleRecording}
          disabled={!isCameraReady || (isProcessing && !isRecording) || !isModelReady}
        >
          <View style={[styles.recordInner, isRecording && styles.recordInnerActive]}>
            <Video color="#fff" size={20} />
          </View>
        </TouchableOpacity>
        <Text style={styles.controlsLabel}>
          {isRecording ? 'Recording... Tap to stop' : 'Tap to record your swing'}
        </Text>
        {isRecording && isModelReady && (
          <Text style={styles.poseStatus}>Pose detection active</Text>
        )}
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
  loadingOverlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 40,
    borderRadius: 20,
    alignSelf: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  poseStatus: {
    marginTop: 8,
    color: '#00FF00',
    fontSize: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
});
