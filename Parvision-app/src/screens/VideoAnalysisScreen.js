import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';
// import ViewShot from 'react-native-view-shot'; // Not installed yet - frame extraction requires native modules
import { usePoseDetection } from '../hooks/usePoseDetection';
import { SkeletonOverlay } from '../components/SkeletonOverlay';
import { Play, Pause, SkipBack, SkipForward, Upload, X } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function VideoAnalysisScreen({ navigation }) {
  const [videoUri, setVideoUri] = useState(null);
  const [videoStatus, setVideoStatus] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFrames, setProcessedFrames] = useState([]); // Store keypoints for each frame
  const [currentFrameKeypoints, setCurrentFrameKeypoints] = useState([]);
  const [frameDimensions, setFrameDimensions] = useState({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT });
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTestSkeleton, setShowTestSkeleton] = useState(false); // Test mode to verify overlay works
  const tapCountRef = useRef(0);
  const lastTapTimeRef = useRef(0);

  const videoRef = useRef(null);
  // const videoViewShotRef = useRef(null); // Not available without ViewShot package
  const { isModelReady, isLoading, detectPose, keypoints } = usePoseDetection();

  // Request media library permissions
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Please grant access to your media library to upload videos.');
        }
      }
    })();
  }, []);

  // Pick video from library
  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setVideoUri(result.assets[0].uri);
        setProcessedFrames([]);
        setCurrentFrameKeypoints([]);
        setProcessingProgress(0);
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'Failed to pick video. Please try again.');
    }
  };

  // Process a single frame at current video position
  // Note: This is a simplified implementation. expo-av doesn't support direct frame extraction.
  // For production, use server-side processing or native modules like react-native-video-processing
  const processFrameAtPosition = useCallback(async (positionMillis, frameNumber) => {
    if (!isModelReady || !videoRef.current || !detectPose) return null;

    try {
      // Pause video if playing
      const currentStatus = await videoRef.current.getStatusAsync();
      const wasPlaying = currentStatus.isPlaying;
      if (wasPlaying) {
        await videoRef.current.pauseAsync();
      }

      // Seek to position
      await videoRef.current.setPositionAsync(positionMillis);
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait for video to seek and render

      // Note: expo-av doesn't support direct frame extraction from video
      // We would need to:
      // 1. Use a native module (react-native-video-processing, ffmpeg-kit-react-native)
      // 2. Send video to server for frame extraction
      // 3. Use expo-gl with video textures (complex)
      
      // For now, this is a placeholder that shows the structure
      // In production, extract the frame image here, convert to tensor, and call detectPose
      
      // Example of what we'd do with actual frame extraction:
      // const frameImage = await extractFrameFromVideo(videoUri, positionMillis);
      // const imageTensor = await convertImageToTensor(frameImage);
      // const keypoints = await detectPose(imageTensor, false);
      
      console.log(`📸 Processing frame ${frameNumber} at ${(positionMillis / 1000).toFixed(1)}s`);
      
      // Resume playback if it was playing
      if (wasPlaying) {
        await videoRef.current.playAsync();
      }
      
      // Return null for now - in production, return detected keypoints
      return null;
    } catch (error) {
      console.error(`Error processing frame at ${positionMillis}ms:`, error);
      return null;
    }
  }, [isModelReady, detectPose]);

  // Process video frames using server-side API
  const processVideoFrames = useCallback(async () => {
    if (!videoUri) {
      console.log('⏸️ Cannot process: no video selected');
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessedFrames([]);

    try {
      console.log('🎬 Starting server-side video analysis...');
      console.log(`📤 Uploading video: ${videoUri}`);

      // Create FormData for file upload
      const formData = new FormData();
      
      // Get file name from URI
      const filename = videoUri.split('/').pop() || 'video.mov';
      const fileType = videoUri.endsWith('.mp4') ? 'video/mp4' : 'video/quicktime';
      
      // Handle file upload differently for web vs native
      if (Platform.OS === 'web') {
        // On web, we need to fetch the file as a blob
        try {
          const response = await fetch(videoUri);
          const blob = await response.blob();
          formData.append('video', blob, filename);
          console.log('📦 Web: Added blob to FormData');
        } catch (error) {
          console.error('❌ Error fetching video for web upload:', error);
          // Fallback: try to use the URI directly (may not work)
          formData.append('video', videoUri);
        }
      } else {
        // On native (iOS/Android), use the object format
        // @ts-ignore - React Native FormData accepts objects with uri, type, name
        formData.append('video', {
          uri: videoUri,
          type: fileType,
          name: filename,
        });
        console.log('📦 Native: Added file object to FormData');
      }

      // API endpoint - adjust this to match your server
      // For web/simulator: Use 'localhost'
      // For physical devices: Use your computer's IP address (192.168.1.93)
      // For production: Use your production server URL
      const USE_PHYSICAL_DEVICE = false; // Set to true only when testing on real device
      const COMPUTER_IP = '192.168.1.93'; // Your computer's IP address
      
      // On web, always use localhost
      const isWeb = Platform.OS === 'web';
      const API_URL = (isWeb || !USE_PHYSICAL_DEVICE)
        ? 'http://localhost:5001/process-video'      // Web/simulator
        : `http://${COMPUTER_IP}:5001/process-video`; // Physical device

      console.log(`📡 Sending request to: ${API_URL}`);
      console.log(`📁 Video URI: ${videoUri}`);
      console.log(`📝 Filename: ${filename}, Type: ${fileType}`);

      // Send video to backend for processing
      // Note: Don't set Content-Type header - let fetch set it automatically with boundary
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        // Remove Content-Type header - React Native will set it with proper boundary
      });

      console.log(`📥 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server error response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || `Server error: ${response.status}` };
        }
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('📦 Server response:', JSON.stringify(result).substring(0, 200) + '...');

      if (!result.success) {
        console.error('❌ Processing failed:', result.error);
        throw new Error(result.error || 'Processing failed');
      }

      if (!result.frames || result.frames.length === 0) {
        console.warn('⚠️ Server returned 0 frames');
        Alert.alert('Warning', 'No frames were processed. The video might be too short or invalid.');
      }

      console.log(`✅ Received ${result.frames?.length || 0} processed frames`);
      if (result.videoInfo) {
        console.log(`📹 Video info: ${result.videoInfo.duration}ms, ${result.videoInfo.fps?.toFixed(2) || 'N/A'} FPS`);
      }

      // Store processed frames
      setProcessedFrames(result.frames || []);
      setProcessingProgress(100);
      setIsProcessing(false);

      // Update frame dimensions if available
      if (videoRef.current) {
        const status = await videoRef.current.getStatusAsync();
        if (status.isLoaded && status.naturalSize) {
          setFrameDimensions({
            width: status.naturalSize.width,
            height: status.naturalSize.height,
          });
        }
      }

      if (result.frames && result.frames.length > 0) {
        Alert.alert('Success', `Processed ${result.frames.length} frames. Skeleton overlay will appear during playback.`);
      } else {
        Alert.alert('Warning', 'Video uploaded but no frames were processed. Check server logs.');
      }
    } catch (error) {
      console.error('❌ Error processing video:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      
      let errorMessage = error.message || 'Failed to process video.';
      
      // Provide more helpful error messages
      if (error.message?.includes('Network request failed') || error.message?.includes('Failed to fetch')) {
        errorMessage = `Cannot connect to server at ${API_URL}.\n\nMake sure:\n1. Server is running (python api_server.py 5001)\n2. Phone and computer are on same Wi-Fi\n3. IP address is correct (192.168.1.93)`;
      } else if (error.message?.includes('ECONNREFUSED')) {
        errorMessage = `Connection refused. Is the server running on port 5001?`;
      }
      
      Alert.alert(
        'Processing Error',
        errorMessage
      );
      setIsProcessing(false);
    }
  }, [videoUri]);

  // Process current video frame during playback in real-time
  // Note: Frame extraction requires server-side processing or native modules
  const processCurrentFrame = useCallback(async () => {
    if (!isModelReady || !videoRef.current || !detectPose) return;

    try {
      const status = await videoRef.current.getStatusAsync();
      if (!status.isLoaded || !status.isPlaying) return;

      const currentTime = status.positionMillis;
      const frameNumber = Math.floor((currentTime / 1000) * 10); // 10 FPS processing

      // Check if we already processed this frame (within 200ms tolerance)
      const existingFrame = processedFrames.find(f => 
        Math.abs(f.timestamp - currentTime) < 200
      );
      
      if (existingFrame && existingFrame.keypoints && existingFrame.keypoints.length > 0) {
        setCurrentFrameKeypoints(existingFrame.keypoints);
        return;
      }

      // Note: Frame extraction from video is not possible with expo-av alone
      // This requires:
      // 1. Server-side processing (send video, get keypoints back)
      // 2. Native modules (react-native-video-processing, ffmpeg-kit-react-native)
      // 3. ViewShot might work but is unreliable with Video components
      
      // For now, we can't extract frames, so no keypoints will be detected
      // The skeleton overlay will appear once keypoints are available
      console.log(`⚠️ Frame extraction not available - cannot process frame ${frameNumber}`);
      
      // Fallback: Use keypoints from pose detection hook if available
      // (This won't work without actual frame extraction, but keeps the code structure)
      
    } catch (error) {
      console.error('Error processing current frame:', error);
    }
  }, [isModelReady, processedFrames, detectPose]);

  // Process frames in real-time during video playback
  useEffect(() => {
    if (isModelReady && videoStatus.isLoaded && isPlaying) {
      console.log('🎬 Starting real-time frame processing during playback');
      // Process frames every 500ms during playback
      // Note: Actual frame extraction requires server-side or native modules
      const interval = setInterval(() => {
        processCurrentFrame();
      }, 500);

      return () => {
        clearInterval(interval);
        console.log('⏹️ Stopped frame processing');
      };
    }
  }, [isModelReady, videoStatus.isLoaded, isPlaying, processCurrentFrame]);

  // Update current frame keypoints based on video playback position
  // Uses processed frames from backend API
  useEffect(() => {
    if (!videoStatus.isLoaded || processedFrames.length === 0) {
      return;
    }

    const currentTime = videoStatus.positionMillis;
    if (currentTime === undefined) return;

    // Find the closest processed frame to current playback position
    const closestFrame = processedFrames.reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.timestamp - currentTime);
      const currDiff = Math.abs(curr.timestamp - currentTime);
      return currDiff < prevDiff ? curr : prev;
    });

    // Only update if we're within 200ms of the frame timestamp
    if (Math.abs(closestFrame.timestamp - currentTime) < 200) {
      setCurrentFrameKeypoints(closestFrame.keypoints || []);
    }
  }, [videoStatus.positionMillis, processedFrames, videoStatus.isLoaded]);

  // Auto-process video when uploaded and loaded
  useEffect(() => {
    if (videoUri && videoStatus.isLoaded && !isProcessing && processedFrames.length === 0) {
      // Automatically start processing when video is uploaded and loaded
      console.log('📹 Video uploaded and loaded, starting automatic processing...');
      // Small delay to ensure video is fully ready
      const timer = setTimeout(() => {
        processVideoFrames();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [videoUri, videoStatus.isLoaded, isProcessing, processedFrames.length, processVideoFrames]);

  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    try {
      const status = await videoRef.current.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await videoRef.current.pauseAsync();
          setIsPlaying(false);
        } else {
          await videoRef.current.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const handleSeek = async (seconds) => {
    if (!videoRef.current) return;

    try {
      const status = await videoRef.current.getStatusAsync();
      if (status.isLoaded) {
        const newPosition = Math.max(0, Math.min(status.durationMillis, status.positionMillis + seconds * 1000));
        await videoRef.current.setPositionAsync(newPosition);
      }
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <X color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Video Analysis</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Video player */}
      {videoUri ? (
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: videoUri }}
            style={styles.video}
            resizeMode="contain"
            onLoad={(status) => {
              setVideoStatus(status);
              if (status.naturalSize) {
                setFrameDimensions({
                  width: status.naturalSize.width,
                  height: status.naturalSize.height,
                });
              }
              console.log('📹 Video loaded:', {
                duration: status.durationMillis,
                isLoaded: status.isLoaded,
                naturalSize: status.naturalSize,
              });
              // Auto-processing will trigger via useEffect when videoStatus.isLoaded becomes true
            }}
            onPlaybackStatusUpdate={(status) => {
              setVideoStatus(status);
              setIsPlaying(status.isPlaying);
            }}
          />

          {/* Skeleton overlay - shows when keypoints are detected */}
          {isModelReady && (
            <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
              {/* Real keypoints from pose detection */}
              {(currentFrameKeypoints.length > 0 || (keypoints && keypoints.length > 0)) && (
                <SkeletonOverlay
                  keypoints={currentFrameKeypoints.length > 0 ? currentFrameKeypoints : (keypoints || [])}
                  imageWidth={frameDimensions.width || SCREEN_WIDTH}
                  imageHeight={frameDimensions.height || SCREEN_HEIGHT}
                />
              )}
              
              {/* Test skeleton overlay - tap debug overlay 3 times to enable */}
              {showTestSkeleton && (
                <SkeletonOverlay
                  keypoints={[
                    { x: 0.5, y: 0.15, score: 0.9, name: 'nose' },
                    { x: 0.45, y: 0.18, score: 0.85, name: 'left_eye' },
                    { x: 0.55, y: 0.18, score: 0.85, name: 'right_eye' },
                    { x: 0.4, y: 0.25, score: 0.8, name: 'left_shoulder' },
                    { x: 0.6, y: 0.25, score: 0.8, name: 'right_shoulder' },
                    { x: 0.35, y: 0.35, score: 0.75, name: 'left_elbow' },
                    { x: 0.65, y: 0.35, score: 0.75, name: 'right_elbow' },
                    { x: 0.3, y: 0.45, score: 0.7, name: 'left_wrist' },
                    { x: 0.7, y: 0.45, score: 0.7, name: 'right_wrist' },
                    { x: 0.45, y: 0.5, score: 0.8, name: 'left_hip' },
                    { x: 0.55, y: 0.5, score: 0.8, name: 'right_hip' },
                    { x: 0.45, y: 0.65, score: 0.75, name: 'left_knee' },
                    { x: 0.55, y: 0.65, score: 0.75, name: 'right_knee' },
                    { x: 0.45, y: 0.85, score: 0.7, name: 'left_ankle' },
                    { x: 0.55, y: 0.85, score: 0.7, name: 'right_ankle' },
                  ]}
                  imageWidth={frameDimensions.width || SCREEN_WIDTH}
                  imageHeight={frameDimensions.height || SCREEN_HEIGHT}
                />
              )}
            </View>
          )}

          {/* Debug overlay - tap 3 times quickly to show test skeleton */}
          {isModelReady && (
            <TouchableOpacity 
              style={styles.debugOverlay}
              onPress={() => {
                const now = Date.now();
                if (!lastTapTimeRef.current || now - lastTapTimeRef.current > 500) {
                  tapCountRef.current = 0;
                }
                tapCountRef.current = tapCountRef.current + 1;
                lastTapTimeRef.current = now;
                
                if (tapCountRef.current >= 3) {
                  setShowTestSkeleton(prev => {
                    const newState = !prev;
                    console.log('🧪 Test skeleton:', newState ? 'ON' : 'OFF');
                    return newState;
                  });
                  tapCountRef.current = 0;
                }
              }}
            >
              <Text style={styles.debugText}>
                Model: {isModelReady ? 'Ready' : 'Loading'}
              </Text>
              <Text style={styles.debugText}>
                Playing: {isPlaying ? 'Yes' : 'No'}
              </Text>
              <Text style={styles.debugText}>
                Keypoints: {keypoints?.length || 0}
              </Text>
              <Text style={styles.debugText}>
                Current: {currentFrameKeypoints.length}
              </Text>
              <Text style={styles.debugText}>
                Processed: {processedFrames.length}
              </Text>
              <Text style={styles.debugText}>
                Test: {showTestSkeleton ? 'ON' : 'OFF'}
              </Text>
              <Text style={[styles.debugText, { fontSize: 8, marginTop: 4, color: '#FFA500' }]}>
                Tap 3x for test
              </Text>
            </TouchableOpacity>
          )}

          {/* Processing overlay */}
          {isProcessing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color="#16a34a" />
              <Text style={styles.processingText}>
                Processing video frames... {Math.round(processingProgress)}%
              </Text>
            </View>
          )}

          {/* Video controls */}
          <View style={styles.controls}>
            <TouchableOpacity onPress={() => handleSeek(-5)} style={styles.controlButton}>
              <SkipBack color="#fff" size={24} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
              {isPlaying ? <Pause color="#fff" size={32} /> : <Play color="#fff" size={32} />}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSeek(5)} style={styles.controlButton}>
              <SkipForward color="#fff" size={24} />
            </TouchableOpacity>
          </View>

          {/* Analyze button - manual trigger if auto-processing doesn't work */}
          {!isProcessing && processedFrames.length === 0 && videoStatus.isLoaded && (
            <View style={styles.analyzeButtonContainer}>
              <TouchableOpacity 
                style={styles.analyzeButton} 
                onPress={processVideoFrames}
              >
                <Text style={styles.analyzeButtonText}>
                  {isProcessing ? 'Analyzing...' : 'Analyze Video'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.uploadContainer}>
          <Upload color="#16a34a" size={64} />
          <Text style={styles.uploadTitle}>Upload Golf Video</Text>
          <Text style={styles.uploadSubtitle}>
            Select a video from your gallery to analyze your swing with AI pose detection
          </Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickVideo}>
            <Text style={styles.uploadButtonText}>Choose Video</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Status info */}
      {videoUri && (
        <View style={styles.statusContainer}>
          {isLoading && (
            <Text style={styles.statusText}>Loading pose detection model...</Text>
          )}
          {!isModelReady && !isLoading && (
            <Text style={styles.statusText}>Pose detection model not ready</Text>
          )}
          {isModelReady && currentFrameKeypoints.length > 0 && (
            <Text style={styles.statusText}>
              {currentFrameKeypoints.length} joints detected
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#000',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.7,
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  controlButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 25,
  },
  playButton: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16a34a',
    borderRadius: 35,
  },
  uploadContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  uploadTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 24,
    marginBottom: 12,
  },
  uploadSubtitle: {
    fontSize: 16,
    color: '#d1d5db',
    textAlign: 'center',
    marginBottom: 32,
  },
  uploadButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 999,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    padding: 16,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
  },
  analyzeButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  analyzeButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  debugOverlay: {
    position: 'absolute',
    top: 100,
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
});
