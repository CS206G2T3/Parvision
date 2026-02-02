import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Video, Camera } from 'lucide-react-native';
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
  const [cameraFacing, setCameraFacing] = useState('back'); // 'back' or 'front'
  const [isProcessingFrame, setIsProcessingFrame] = useState(false);
  const [recordedKeypoints, setRecordedKeypoints] = useState([]); // Store keypoints during recording

  // Pose detection hook
  const { isModelReady, isLoading, keypoints, detectPose, clearKeypoints } = usePoseDetection();

  // Ref for frame capture interval
  const frameIntervalRef = useRef(null);
  const isCapturingRef = useRef(false);
  const frameCountRef = useRef(0);

  // Process a single frame for pose detection
  // Only runs when recording is active
  const processFrame = useCallback(async () => {
    // Skip if not recording or conditions not met
    if (!isRecording || !cameraRef.current || !isModelReady || isCapturingRef.current || !isCameraReady) {
      return;
    }

    isCapturingRef.current = true;
    setIsProcessingFrame(true);
    frameCountRef.current += 1;

    try {
      // Capture a frame from the camera
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.3,
        skipProcessing: true,
        base64: true,
      });
      
      if (!photo) {
        return; // Silently skip if photo capture fails
      }

      // Try to get base64 from photo object first, fallback to reading file
      let imgB64 = null;
      
      if (photo.base64 && typeof photo.base64 === 'string') {
        imgB64 = photo.base64;
      } else if (photo.uri) {
        // Fallback: read from file
        try {
          imgB64 = await FileSystem.readAsStringAsync(photo.uri, {
            encoding: 'base64',
          });
        } catch (readError) {
          console.error('❌ Error reading file:', readError.message);
          return; // Skip this frame
        }
      } else {
        return; // Skip if no base64 or uri
      }

      if (!imgB64 || imgB64.length === 0) {
        return; // Skip empty data
      }

      // Store frame dimensions for skeleton scaling
      if (photo.width && photo.height) {
        setFrameDimensions({ width: photo.width, height: photo.height });
      }

      // Convert base64 string to Uint8Array
      let rawImageData;
      try {
        const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
        rawImageData = new Uint8Array(imgBuffer);
      } catch (convertError) {
        console.error('❌ Error converting base64:', convertError.message);
        return; // Skip this frame
      }

      // Decode JPEG to tensor
      let imageTensor;
      try {
        imageTensor = decodeJpeg(rawImageData);
        
        // Verify tensor shape - MoveNet expects [batch, height, width, channels] or [height, width, channels]
        const shape = imageTensor.shape;
        console.log(`📐 Decoded tensor shape: [${shape.join(', ')}]`);
        
        // Ensure tensor has the right shape for MoveNet
        // decodeJpeg returns [height, width, 3], MoveNet can handle this
        if (shape.length === 3) {
          // Tensor is [height, width, channels] - this is fine for MoveNet
          console.log('✅ Tensor shape is correct for MoveNet');
        } else if (shape.length === 4) {
          // Tensor is [batch, height, width, channels] - also fine
          console.log('✅ Tensor shape is correct for MoveNet (with batch dimension)');
        } else {
          console.warn('⚠️ Unexpected tensor shape:', shape);
        }
      } catch (decodeError) {
        console.error('❌ Error decoding JPEG:', decodeError.message);
        console.error('   Error stack:', decodeError.stack);
        return; // Skip this frame
      }

      // Run pose detection
      // Flip horizontally for front-facing camera (mirrored view needs flipping)
      const flipHorizontal = cameraFacing === 'front';
      try {
        // Verify tensor shape before detection
        const tensorShape = imageTensor.shape;
        console.log(`📊 Frame #${frameCountRef.current} - Tensor shape:`, tensorShape);
        
        const detectedKeypoints = await detectPose(imageTensor, flipHorizontal);
        
        // Verify detection results
        if (detectedKeypoints && detectedKeypoints.length > 0) {
          console.log(`✅ Frame #${frameCountRef.current} - Detected ${detectedKeypoints.length} keypoints`);
          
          // Log first few keypoints for verification
          const sampleKeypoints = detectedKeypoints.slice(0, 3).map(kp => ({
            name: kp.name,
            x: kp.x?.toFixed(3),
            y: kp.y?.toFixed(3),
            score: kp.score?.toFixed(3),
          }));
          console.log('   Sample keypoints:', sampleKeypoints);
          
          // Store keypoints during recording for analysis
          if (isRecording) {
            setRecordedKeypoints(prev => [...prev, {
              timestamp: Date.now(),
              keypoints: detectedKeypoints,
              frameNumber: frameCountRef.current,
            }]);
          }
        } else {
          console.log(`⚠️ Frame #${frameCountRef.current} - No keypoints detected`);
        }
      } catch (poseError) {
        console.error(`❌ Frame #${frameCountRef.current} - Error detecting pose:`, poseError.message);
        console.error('   Error stack:', poseError.stack);
      } finally {
        // Always dispose tensor to free memory
        tf.dispose(imageTensor);
      }

      // Clean up the temporary photo file if it exists
      if (photo.uri) {
        try {
          await FileSystem.deleteAsync(photo.uri, { idempotent: true });
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    } catch (error) {
      // Only log unexpected errors (not expected failures like photo capture)
      if (error.message && !error.message.includes('takePictureAsync')) {
        console.error('❌ Unexpected error in processFrame:', error.message);
      }
    } finally {
      isCapturingRef.current = false;
      setIsProcessingFrame(false);
    }
  }, [isModelReady, isCameraReady, detectPose, cameraFacing, isRecording]);

  // Start/stop frame processing - only when recording is active
  useEffect(() => {
    const conditions = {
      isRecording,
      isModelReady,
      isCameraReady,
      hasCameraRef: !!cameraRef.current,
    };
    
    if (isRecording && isModelReady && isCameraReady && cameraRef.current) {
      // Clear any existing interval
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
        frameIntervalRef.current = null;
      }
      
      // Start the interval for pose detection during recording
      frameIntervalRef.current = setInterval(() => {
        processFrame();
      }, FRAME_INTERVAL_MS);
      
      console.log('✅ CV pose detection started - analyzing frames during recording');
      console.log('   Conditions:', conditions);
      console.log('   Frame interval:', FRAME_INTERVAL_MS, 'ms');
      frameCountRef.current = 0; // Reset frame counter
    } else {
      // Stop frame processing when not recording
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
        frameIntervalRef.current = null;
        console.log('⏹️ CV pose detection stopped');
        console.log('   Conditions:', conditions);
      }
    }

    return () => {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
        frameIntervalRef.current = null;
      }
    };
  }, [isRecording, isModelReady, isCameraReady, processFrame]);

  // Clear keypoints when camera/model becomes unavailable
  useEffect(() => {
    if (!isModelReady || !isCameraReady) {
      clearKeypoints();
    }
  }, [isModelReady, isCameraReady, clearKeypoints]);

  const handleRecordingFinished = (video) => {
    console.log('✅ Video recording finished:', video.uri);
    console.log('📊 CV Analysis Summary:');
    console.log(`   - Total frames analyzed: ${recordedKeypoints.length}`);
    console.log(`   - Video saved to: ${video.uri}`);
    
    // Calculate statistics from recorded keypoints
    if (recordedKeypoints.length > 0) {
      const allKeypointNames = new Set();
      recordedKeypoints.forEach(frame => {
        frame.keypoints.forEach(kp => {
          if (kp.name) allKeypointNames.add(kp.name);
        });
      });
      console.log(`   - Detected joints: ${Array.from(allKeypointNames).join(', ')}`);
      console.log(`   - Average keypoints per frame: ${(recordedKeypoints.reduce((sum, f) => sum + f.keypoints.length, 0) / recordedKeypoints.length).toFixed(1)}`);
    }
    
    // TODO: Send video and pose data to backend for analysis
    // This is where you would integrate with the Python CV backend
    // Example: await sendToBackend({ 
    //   videoUri: video.uri, 
    //   keypoints: recordedKeypoints,
    //   frameDimensions: frameDimensions 
    // });
    
    // Clear recorded keypoints after processing
    setRecordedKeypoints([]);
  };

  const toggleRecording = async () => {
    if (!cameraRef.current || !isCameraReady) return;
    if (isProcessing && !isRecording) return;
    if (!isModelReady) {
      console.warn('Pose detection model not ready yet');
      return;
    }

    // Start recording
    if (!isRecording) {
      console.log('🎥 Starting recording with CV pose detection...');
      setIsRecording(true);
      setIsProcessing(true);
      setRecordedKeypoints([]); // Clear previous keypoints
      clearKeypoints(); // Clear current keypoints display
      
      // The useEffect will start the frame processing interval automatically
      // when isRecording becomes true
      
      try {
        const video = await cameraRef.current.recordAsync({
          quality: '720p',
          maxDuration: 60, // Max 60 seconds
        });
        handleRecordingFinished(video);
      } catch (error) {
        console.warn('Error while recording video:', error);
      } finally {
        setIsRecording(false);
        setIsProcessing(false);
        // Clear interval when recording stops
        if (frameIntervalRef.current) {
          clearInterval(frameIntervalRef.current);
          frameIntervalRef.current = null;
        }
      }
      return;
    }

    // Stop recording
    console.log('⏹️ Stopping recording...');
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
    if (isLoading) return 'Loading CV model (MoveNet)...';
    if (!isModelReady) return 'CV model not ready';
    if (isRecording) {
      const frameCount = recordedKeypoints.length;
      const currentKeypoints = keypoints?.length || 0;
      return `🎥 Recording - ${frameCount} frames analyzed, ${currentKeypoints} joints detected`;
    }
    return 'Tap to record your swing - CV ready';
  };

  // Permission granted – show live camera preview
  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing={cameraFacing}
        mode="video"
        onCameraReady={() => {
          console.log('📷 Camera ready callback fired');
          console.log('   Camera facing:', cameraFacing);
          console.log('   Camera ref:', !!cameraRef.current);
          console.log('   takePictureAsync available:', !!cameraRef.current?.takePictureAsync);
          setIsCameraReady(true);
        }}
      />

      {/* Skeleton overlay - shown when keypoints are detected during recording */}
      {isRecording && isModelReady && keypoints && keypoints.length > 0 && (
        <View style={[StyleSheet.absoluteFillObject, { pointerEvents: 'none' }]}>
          <SkeletonOverlay
            keypoints={keypoints}
            imageWidth={frameDimensions.width || SCREEN_WIDTH}
            imageHeight={frameDimensions.height || SCREEN_HEIGHT}
          />
        </View>
      )}
      
      {/* Debug info - shows keypoint count */}
      {isModelReady && (
        <View style={styles.debugOverlay}>
          <Text style={styles.debugText}>
            Keypoints: {keypoints && Array.isArray(keypoints) ? keypoints.length : 0}
          </Text>
          <Text style={styles.debugText}>
            Frame: {frameDimensions?.width || 0}x{frameDimensions?.height || 0}
          </Text>
          <Text style={styles.debugText}>
            Model: {isModelReady ? 'Ready' : 'Loading'}
          </Text>
          <Text style={styles.debugText}>
            Camera: {isCameraReady ? 'Ready' : 'Starting'}
          </Text>
          <Text style={styles.debugText}>
            Processing: {isProcessingFrame ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.debugText}>
            Frames: {frameCountRef.current}
          </Text>
          <Text style={styles.debugText}>
            Interval: {frameIntervalRef.current ? 'Active' : 'Inactive'}
          </Text>
          <Text style={styles.debugText}>
            Camera: {cameraFacing === 'front' ? 'Front' : 'Back'}
          </Text>
          <Text style={styles.debugText}>
            Recording: {isRecording ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.debugText}>
            Frames Analyzed: {recordedKeypoints.length}
          </Text>
        </View>
      )}

      {/* Model loading indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#16a34a" />
          <Text style={styles.loadingText}>Loading pose detection...</Text>
        </View>
      )}

      {/* Camera flip button - top right */}
      <TouchableOpacity
        style={styles.flipButton}
        onPress={() => {
          const newFacing = cameraFacing === 'back' ? 'front' : 'back';
          console.log('🔄 Switching camera from', cameraFacing, 'to', newFacing);
          // Clear interval first
          if (frameIntervalRef.current) {
            clearInterval(frameIntervalRef.current);
            frameIntervalRef.current = null;
          }
          setCameraFacing(newFacing);
          setIsCameraReady(false); // Reset camera ready state when flipping
          clearKeypoints(); // Clear keypoints when switching cameras
        }}
        disabled={isRecording}
      >
        <View style={styles.flipButtonContent}>
          <Camera color="#fff" size={18} style={styles.cameraIcon} />
          <Text style={styles.arrowText}>↻</Text>
        </View>
      </TouchableOpacity>

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
        {isRecording && isModelReady && keypoints && keypoints.length > 0 && (
          <Text style={styles.poseStatus}>
            🎥 CV analyzing - {keypoints.length} joints detected
          </Text>
        )}
        {isRecording && isModelReady && (!keypoints || keypoints.length === 0) && (
          <Text style={styles.poseStatusWaiting}>
            ⏳ CV analyzing frame...
          </Text>
        )}
        {!isRecording && isModelReady && (
          <Text style={styles.poseStatus}>
            ✅ CV ready - tap to start recording
          </Text>
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
    fontWeight: '600',
  },
  poseStatusWaiting: {
    marginTop: 8,
    color: '#FFA500',
    fontSize: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  debugOverlay: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 8,
    zIndex: 1000,
  },
  debugText: {
    color: '#00FF00',
    fontSize: 10,
    fontFamily: 'monospace',
    marginVertical: 2,
  },
  flipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  flipButtonContent: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  cameraIcon: {
    position: 'absolute',
    zIndex: 2,
  },
  arrowText: {
    position: 'absolute',
    top: -2,
    left: -2,
    fontSize: 12,
    color: '#fff',
    zIndex: 1,
    opacity: 0.8,
  },
});
