import { useRef, useState, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as poseDetection from '@tensorflow-models/pose-detection';

export function usePoseDetection() {
  const [isModelReady, setIsModelReady] = useState(false);
  const [keypoints, setKeypoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const detectorRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function loadModel() {
      try {
        // Wait for TensorFlow.js to be ready
        await tf.ready();
        console.log('TensorFlow.js backend:', tf.getBackend());

        // Create MoveNet detector with Lightning model (faster, good for real-time)
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          }
        );

        if (isMounted) {
          detectorRef.current = detector;
          setIsModelReady(true);
          setIsLoading(false);
          console.log('MoveNet model loaded successfully');
        }
      } catch (error) {
        console.error('Error loading MoveNet model:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadModel();

    return () => {
      isMounted = false;
      if (detectorRef.current) {
        detectorRef.current.dispose();
      }
    };
  }, []);

  const detectPose = useCallback(async (imageTensor, flipHorizontal = false) => {
    if (!detectorRef.current || !isModelReady) {
      console.warn('⚠️ detectPose called but detector not ready:', {
        hasDetector: !!detectorRef.current,
        isModelReady,
      });
      return null;
    }

    try {
      // Verify tensor before processing
      if (!imageTensor) {
        console.error('❌ detectPose: imageTensor is null or undefined');
        return null;
      }
      
      const tensorShape = imageTensor.shape;
      if (!tensorShape || tensorShape.length < 3) {
        console.error('❌ detectPose: Invalid tensor shape:', tensorShape);
        return null;
      }

      const startTime = Date.now();
      const poses = await detectorRef.current.estimatePoses(imageTensor, {
        maxPoses: 1,
        flipHorizontal: flipHorizontal, // Flip for front-facing camera
      });
      const detectionTime = Date.now() - startTime;

      if (poses && poses.length > 0) {
        const normalizedKeypoints = poses[0].keypoints;
        if (normalizedKeypoints && normalizedKeypoints.length > 0) {
          // Filter keypoints by confidence
          const validKeypoints = normalizedKeypoints.filter(kp => kp && kp.score > 0.3);
          
          if (validKeypoints.length > 0) {
            setKeypoints(validKeypoints);
            console.log(`✅ Pose detected: ${validKeypoints.length}/${normalizedKeypoints.length} keypoints (${detectionTime}ms)`);
            return validKeypoints;
          } else {
            console.log(`⚠️ Pose detected but all ${normalizedKeypoints.length} keypoints below confidence threshold`);
            setKeypoints([]);
            return null;
          }
        } else {
          console.log('⚠️ Pose detected but no keypoints in result');
          setKeypoints([]);
          return null;
        }
      } else {
        // Only log occasionally to avoid spam
        if (Math.random() < 0.1) { // Log ~10% of the time
          console.log('⚠️ No poses detected');
        }
        setKeypoints([]);
        return null;
      }
    } catch (error) {
      console.error('❌ Error detecting pose:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      setKeypoints([]);
      return null;
    }
  }, [isModelReady]);

  const clearKeypoints = useCallback(() => {
    setKeypoints([]);
  }, []);

  return {
    isModelReady,
    isLoading,
    keypoints,
    detectPose,
    clearKeypoints,
  };
}
