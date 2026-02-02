import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';
import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// MoveNet keypoint indices
// 0: nose, 1: left_eye, 2: right_eye, 3: left_ear, 4: right_ear
// 5: left_shoulder, 6: right_shoulder, 7: left_elbow, 8: right_elbow
// 9: left_wrist, 10: right_wrist, 11: left_hip, 12: right_hip
// 13: left_knee, 14: right_knee, 15: left_ankle, 16: right_ankle

// Skeleton connections (edges between keypoints)
const SKELETON_EDGES = [
  // Head
  [0, 1], [0, 2], [1, 3], [2, 4],
  // Torso
  [5, 6], [5, 11], [6, 12], [11, 12],
  // Left arm
  [5, 7], [7, 9],
  // Right arm
  [6, 8], [8, 10],
  // Left leg
  [11, 13], [13, 15],
  // Right leg
  [12, 14], [14, 16],
];

// Confidence threshold for displaying keypoints
const MIN_CONFIDENCE = 0.1; // Lowered from 0.3 to show more keypoints

// Colors for the skeleton
const KEYPOINT_COLOR = '#FF4444';
const SKELETON_COLOR = '#00FF00';
const KEYPOINT_RADIUS = 6;
const LINE_WIDTH = 3;

export function SkeletonOverlay({ keypoints, imageWidth, imageHeight }) {
  if (!keypoints || keypoints.length === 0) {
    return null;
  }

  // Log keypoint info occasionally for debugging
  if (Math.random() < 0.05) { // Log ~5% of renders
    console.log('🎨 SkeletonOverlay rendering:', {
      keypointCount: keypoints.length,
      sampleKeypoints: keypoints.slice(0, 3).map(kp => ({
        name: kp.name,
        x: kp.x?.toFixed(3),
        y: kp.y?.toFixed(3),
        score: kp.score?.toFixed(3),
      })),
    });
  }

  // Calculate scaling factors
  // Keypoints are normalized (0-1) relative to the video's natural dimensions
  // We need to scale them to the actual rendered video size on screen
  // Since the video uses resizeMode="contain", we need to account for the aspect ratio
  
  // Use screen dimensions for now - the overlay is positioned absolutely over the video
  // The video container should match the video's rendered size
  const scaleX = SCREEN_WIDTH;
  const scaleY = SCREEN_HEIGHT;
  
  // If we have image dimensions, calculate aspect ratio and adjust scaling
  let finalScaleX = scaleX;
  let finalScaleY = scaleY;
  
  if (imageWidth && imageHeight) {
    const imageAspect = imageWidth / imageHeight;
    const screenAspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    
    // If image is taller (portrait), scale based on width
    // If image is wider (landscape), scale based on height
    if (imageAspect < screenAspect) {
      // Image is taller - scale based on width
      finalScaleX = SCREEN_WIDTH;
      finalScaleY = SCREEN_WIDTH / imageAspect;
    } else {
      // Image is wider - scale based on height
      finalScaleX = SCREEN_HEIGHT * imageAspect;
      finalScaleY = SCREEN_HEIGHT;
    }
  }

  console.log('🎨 SkeletonOverlay scaling:', {
    keypointCount: keypoints.length,
    imageWidth,
    imageHeight,
    imageAspect: imageWidth && imageHeight ? (imageWidth / imageHeight).toFixed(2) : 'N/A',
    screenAspect: (SCREEN_WIDTH / SCREEN_HEIGHT).toFixed(2),
    scaleX: finalScaleX.toFixed(0),
    scaleY: finalScaleY.toFixed(0),
    screenWidth: SCREEN_WIDTH,
    screenHeight: SCREEN_HEIGHT,
  });

  // Transform keypoint coordinates to screen coordinates
  // MoveNet keypoints are normalized (0-1), so we multiply by calculated dimensions
  const transformPoint = (kp, index) => {
    if (!kp) return null;
    
    const x = (kp.x || 0) * finalScaleX;
    const y = (kp.y || 0) * finalScaleY;
    const score = kp.score || 0;
    
    return {
      x,
      y,
      score,
      name: kp.name,
    };
  };

  const transformedKeypoints = keypoints.map((kp, index) => transformPoint(kp, index)).filter(Boolean);

  return (
    <Svg style={[StyleSheet.absoluteFillObject, { pointerEvents: 'none' }]}>
      {/* Draw skeleton connections (lines) first so they appear behind keypoints */}
      {SKELETON_EDGES.map(([startIdx, endIdx], index) => {
        const startKp = transformedKeypoints[startIdx];
        const endKp = transformedKeypoints[endIdx];

        // Only draw line if both keypoints have sufficient confidence
        if (
          startKp &&
          endKp &&
          startKp.score > MIN_CONFIDENCE &&
          endKp.score > MIN_CONFIDENCE
        ) {
          return (
            <Line
              key={`edge-${index}`}
              x1={startKp.x}
              y1={startKp.y}
              x2={endKp.x}
              y2={endKp.y}
              stroke={SKELETON_COLOR}
              strokeWidth={LINE_WIDTH}
              strokeLinecap="round"
            />
          );
        }
        return null;
      })}

      {/* Draw keypoints (circles) */}
      {transformedKeypoints.map((kp, index) => {
        if (kp && kp.score > MIN_CONFIDENCE) {
          return (
            <Circle
              key={`kp-${index}`}
              cx={kp.x}
              cy={kp.y}
              r={KEYPOINT_RADIUS}
              fill={KEYPOINT_COLOR}
              stroke="#FFFFFF"
              strokeWidth={2}
            />
          );
        }
        return null;
      })}
    </Svg>
  );
}

export default SkeletonOverlay;
