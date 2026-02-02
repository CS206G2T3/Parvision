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
  ScrollView,
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
  const [videoFileName, setVideoFileName] = useState(null); // Store original filename
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
      console.log('📹 Starting video picker...');
      
      // Request permissions first (especially for web)
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Please grant access to your media library to upload videos.');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
        videoMaxDuration: 60, // Limit to 60 seconds for faster processing
      });

      console.log('📹 ImagePicker result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const videoUri = asset.uri;
        const fileSize = asset.fileSize || 0;
        
        // Extract filename - prefer fileName property, fallback to extracting from URI
        let fileName = asset.fileName || null;
        if (!fileName && videoUri) {
          // Try to extract from URI
          const uriParts = videoUri.split('/');
          const lastPart = uriParts[uriParts.length - 1];
          // If it's a blob URL or doesn't have extension, use default
          if (lastPart.includes('.') && !lastPart.startsWith('blob:')) {
            fileName = lastPart;
          }
        }
        
        // Ensure filename has a valid extension
        if (!fileName || !fileName.match(/\.(mp4|mov|avi|mkv|MP4|MOV)$/i)) {
          // Default to .mov if we can't determine
          fileName = fileName ? `${fileName}.mov` : 'video.mov';
        }
        
        console.log('✅ Video selected:', videoUri);
        console.log(`📝 Original filename: ${fileName}`);
        console.log(`📊 Video size: ${(fileSize / (1024 * 1024)).toFixed(2)} MB`);
        
        // Use requestAnimationFrame to prevent blocking UI
        requestAnimationFrame(() => {
          setVideoUri(videoUri);
          setVideoFileName(fileName);
          setProcessedFrames([]);
          setCurrentFrameKeypoints([]);
          setProcessingProgress(0);
        });
      } else if (result.canceled) {
        console.log('ℹ️ User canceled video selection');
      } else {
        console.warn('⚠️ No video asset found in result:', result);
        Alert.alert('Error', 'No video was selected. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error picking video:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      Alert.alert(
        'Error', 
        `Failed to pick video: ${error.message || 'Unknown error'}. ${Platform.OS === 'web' ? 'Make sure you\'re using a modern browser that supports file uploads.' : 'Please try again.'}`
      );
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
      
      // Use stored filename or extract from URI
      let filename = videoFileName || 'video.mov';
      
      // Ensure filename has valid extension for server validation
      if (!filename.match(/\.(mp4|mov|avi|mkv|MP4|MOV)$/i)) {
        // Determine extension from URI or default to .mov
        if (videoUri.includes('.mp4') || videoUri.includes('.MP4')) {
          filename = filename.replace(/\.[^.]*$/, '') + '.mp4';
        } else {
          filename = filename.replace(/\.[^.]*$/, '') + '.mov';
        }
      }
      
      // Determine MIME type from filename extension
      const fileExtension = filename.split('.').pop()?.toLowerCase();
      let fileType = 'video/quicktime'; // default
      if (fileExtension === 'mp4') {
        fileType = 'video/mp4';
      } else if (fileExtension === 'avi') {
        fileType = 'video/x-msvideo';
      } else if (fileExtension === 'mkv') {
        fileType = 'video/x-matroska';
      }
      
      // Handle file upload differently for web vs native
      if (Platform.OS === 'web') {
        // On web, we need to fetch the file as a blob
        try {
          const response = await fetch(videoUri);
          const blob = await response.blob();
          // Create a new File object with the correct filename
          const file = new File([blob], filename, { type: fileType });
          formData.append('video', file);
          console.log('📦 Web: Added blob to FormData with filename:', filename);
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
        console.log('📦 Native: Added file object to FormData with filename:', filename);
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
      const frames = result.frames || [];
      setProcessedFrames(frames);
      setProcessingProgress(100);
      setIsProcessing(false);
      
      // Log keypoint info for debugging
      if (frames.length > 0) {
        const firstFrame = frames[0];
        console.log('📊 First frame keypoints:', {
          frameNumber: firstFrame.frameNumber,
          timestamp: firstFrame.timestamp,
          keypointCount: firstFrame.keypoints?.length || 0,
          sampleKeypoints: firstFrame.keypoints?.slice(0, 3).map(kp => ({
            name: kp.name,
            x: kp.x?.toFixed(3),
            y: kp.y?.toFixed(3),
            score: kp.score?.toFixed(3),
          })) || [],
        });
        
        // Set initial keypoints from first frame
        if (firstFrame.keypoints && firstFrame.keypoints.length > 0) {
          setCurrentFrameKeypoints(firstFrame.keypoints);
          console.log('✅ Set initial keypoints from first processed frame');
        }
      }

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
      if (processedFrames.length === 0 && videoStatus.isLoaded) {
        console.log('⚠️ No processed frames available yet');
      }
      return;
    }

    const currentTime = videoStatus.positionMillis;
    if (currentTime === undefined) {
      console.log('⚠️ Video position not available');
      return;
    }

    // Find the closest processed frame to current playback position
    const closestFrame = processedFrames.reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.timestamp - currentTime);
      const currDiff = Math.abs(curr.timestamp - currentTime);
      return currDiff < prevDiff ? curr : prev;
    });

    const timeDiff = Math.abs(closestFrame.timestamp - currentTime);
    
    // Relaxed threshold: show keypoints if within 500ms (was 200ms)
    // Also show the first frame if video hasn't started playing yet
    if (timeDiff < 500 || (currentTime === 0 && processedFrames.length > 0)) {
      const frameKeypoints = closestFrame.keypoints || [];
      if (frameKeypoints.length > 0) {
        setCurrentFrameKeypoints(frameKeypoints);
        if (Math.random() < 0.1) { // Log occasionally
          console.log(`✅ Showing keypoints: ${frameKeypoints.length} keypoints at ${currentTime}ms (frame at ${closestFrame.timestamp}ms, diff: ${timeDiff}ms)`);
        }
      } else {
        console.log('⚠️ Closest frame has no keypoints');
        setCurrentFrameKeypoints([]);
      }
    } else {
      // Clear keypoints if too far from any frame
      if (currentFrameKeypoints.length > 0) {
        setCurrentFrameKeypoints([]);
      }
    }
  }, [videoStatus.positionMillis, processedFrames, videoStatus.isLoaded]);

  // Auto-process video when uploaded and loaded (with delay to prevent lag)
  useEffect(() => {
    if (videoUri && videoStatus.isLoaded && !isProcessing && processedFrames.length === 0) {
      // Delay processing to allow UI to render first and prevent lag
      console.log('📹 Video uploaded and loaded, will start processing in 2 seconds...');
      const timer = setTimeout(() => {
        // Only start if still no frames processed (user might have canceled)
        if (processedFrames.length === 0 && !isProcessing) {
          console.log('🚀 Starting automatic video processing...');
          processVideoFrames();
        }
      }, 2000); // 2 second delay to prevent UI lag
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
      {/* Header - Fixed at top */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <X color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Video Analysis</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Scrollable content */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
        {/* Video player */}
        {videoUri ? (
        <View style={styles.videoContainer}>
          <View style={styles.videoWrapper}>
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
                console.log('📐 Video dimensions set:', {
                  width: status.naturalSize.width,
                  height: status.naturalSize.height,
                });
              }
              console.log('📹 Video loaded:', {
                duration: status.durationMillis,
                isLoaded: status.isLoaded,
                naturalSize: status.naturalSize,
                videoUri: videoUri?.substring(0, 50) + '...',
              });
              // Auto-processing will trigger via useEffect when videoStatus.isLoaded becomes true
            }}
            onError={(error) => {
              console.error('❌ Video load error:', error);
            }}
            onPlaybackStatusUpdate={(status) => {
              setVideoStatus(status);
              setIsPlaying(status.isPlaying);
            }}
          />
          </View>

          {/* Skeleton overlay - shows when keypoints are detected */}
          {isModelReady && (
            <View style={[StyleSheet.absoluteFillObject, { pointerEvents: 'none', zIndex: 5 }]}>
              {/* Real keypoints from pose detection */}
              {/* Show keypoints if we have processed frames, even if video isn't playing */}
              {(() => {
                // Priority: currentFrameKeypoints > first processed frame > keypoints from hook
                let keypointsToShow = null;
                
                if (currentFrameKeypoints.length > 0) {
                  keypointsToShow = currentFrameKeypoints;
                  console.log('✅ Using currentFrameKeypoints:', currentFrameKeypoints.length);
                } else if (processedFrames.length > 0 && processedFrames[0].keypoints && processedFrames[0].keypoints.length > 0) {
                  // Fallback: show first frame's keypoints if video hasn't started
                  keypointsToShow = processedFrames[0].keypoints;
                  console.log('✅ Using first processed frame keypoints:', processedFrames[0].keypoints.length);
                } else if (keypoints && keypoints.length > 0) {
                  keypointsToShow = keypoints;
                  console.log('✅ Using hook keypoints:', keypoints.length);
                }
                
                if (keypointsToShow && keypointsToShow.length > 0) {
                  console.log('🎨 Rendering SkeletonOverlay with:', {
                    keypointCount: keypointsToShow.length,
                    frameDimensions,
                    sampleKeypoint: keypointsToShow[0],
                  });
                  return (
                    <SkeletonOverlay
                      keypoints={keypointsToShow}
                      imageWidth={frameDimensions.width || SCREEN_WIDTH}
                      imageHeight={frameDimensions.height || SCREEN_HEIGHT}
                    />
                  );
                } else {
                  console.log('⚠️ No keypoints to show');
                }
                return null;
              })()}
              
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
                Current KP: {currentFrameKeypoints.length}
              </Text>
              <Text style={styles.debugText}>
                Video Pos: {videoStatus.positionMillis ? `${Math.round(videoStatus.positionMillis / 1000)}s` : 'N/A'}
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
          
          <TouchableOpacity 
            style={styles.uploadButton} 
            onPress={pickVideo}
          >
            <Text style={styles.uploadButtonText}>Choose Video</Text>
          </TouchableOpacity>
          
          {Platform.OS === 'web' && (
            <Text style={[styles.uploadSubtitle, { marginTop: 16, fontSize: 12, color: '#9ca3af' }]}>
              Note: On web, make sure your browser supports file uploads. If the picker doesn't open, try a different browser.
            </Text>
          )}
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    ...(Platform.OS === 'web' && {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }),
  },
  scrollContainer: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'visible', // Allow horizontal overflow for wide videos
      WebkitOverflowScrolling: 'touch',
    }),
  },
  scrollContent: {
    paddingBottom: 100,
    ...(Platform.OS === 'web' && {
      minHeight: '100%',
      overflow: 'visible', // Don't clip content
    }),
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
    position: 'relative',
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    ...(Platform.OS === 'web' && {
      display: 'block',
      width: '100%',
      overflow: 'visible',
    }),
  },
  videoWrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' && {
      width: '100%',
      overflow: 'visible',
    }),
  },
  video: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.5,
    backgroundColor: '#000',
    ...(Platform.OS === 'web' && {
      width: '100%',
      maxWidth: '100%',
      minHeight: 400, // Ensure video has a minimum height so it's visible
      height: 'auto',
      objectFit: 'contain', // Ensures full video is visible, maintains aspect ratio
      display: 'block',
      margin: '0 auto', // Center the video
      visibility: 'visible', // Ensure video is visible
    }),
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
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    zIndex: 100,
    ...(Platform.OS === 'web' && {
      zIndex: 100,
      position: 'absolute',
    }),
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
