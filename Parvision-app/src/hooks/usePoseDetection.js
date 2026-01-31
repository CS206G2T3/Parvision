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

  const detectPose = useCallback(async (imageTensor) => {
    if (!detectorRef.current || !isModelReady) {
      return null;
    }

    try {
      const poses = await detectorRef.current.estimatePoses(imageTensor, {
        maxPoses: 1,
        flipHorizontal: false,
      });

      if (poses.length > 0) {
        const normalizedKeypoints = poses[0].keypoints;
        setKeypoints(normalizedKeypoints);
        return normalizedKeypoints;
      }
    } catch (error) {
      console.warn('Error detecting pose:', error);
    }

    return null;
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
