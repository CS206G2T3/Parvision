"""
Flask API server for video pose detection processing.
Accepts video uploads, extracts frames, processes with MoveNet, and returns keypoints.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
import tempfile
import os
from werkzeug.utils import secure_filename
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for React Native app

# Configuration
UPLOAD_FOLDER = tempfile.gettempdir()
ALLOWED_EXTENSIONS = {'mp4', 'mov', 'avi', 'mkv', 'MOV', 'MP4'}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Load MoveNet model (Lightning) - loaded once at startup
print("Loading MoveNet model...")
try:
    model = hub.load("https://tfhub.dev/google/movenet/singlepose/lightning/4")
    movenet = model.signatures["serving_default"]
    print("✅ MoveNet model loaded successfully")
except Exception as e:
    print(f"❌ Error loading MoveNet model: {e}")
    movenet = None

# MoveNet keypoint names (17 keypoints)
KEYPOINT_NAMES = [
    'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
    'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
    'left_wrist', 'right_wrist', 'left_hip', 'right_hip',
    'left_knee', 'right_knee', 'left_ankle', 'right_ankle'
]

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_frames(video_path, frame_rate=10):
    """
    Extract frames from video at specified frame rate.
    
    Args:
        video_path: Path to video file
        frame_rate: Frames per second to extract (default: 10)
    
    Returns:
        List of (frame_number, timestamp_ms, frame_image) tuples
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"Could not open video: {video_path}")
    
    # Get video properties
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration_ms = int((total_frames / fps) * 1000) if fps > 0 else 0
    
    frame_interval = int(fps / frame_rate) if fps > 0 else 1
    frames = []
    frame_number = 0
    extracted_count = 0
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        # Extract frame at specified interval
        if frame_number % frame_interval == 0:
            timestamp_ms = int((frame_number / fps) * 1000) if fps > 0 else frame_number * 100
            frames.append((extracted_count, timestamp_ms, frame))
            extracted_count += 1
        
        frame_number += 1
    
    cap.release()
    print(f"📹 Extracted {len(frames)} frames from video (FPS: {fps:.2f}, Duration: {duration_ms}ms)")
    return frames, fps, duration_ms

def detect_pose_in_frame(frame):
    """
    Detect pose in a single frame using MoveNet.
    
    Args:
        frame: OpenCV BGR frame (numpy array)
    
    Returns:
        List of keypoints in format: [{x, y, score, name}, ...]
    """
    if movenet is None:
        return []
    
    # Convert BGR to RGB
    img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    # Resize and pad to MoveNet input (192x192)
    input_img = tf.image.resize_with_pad(
        tf.expand_dims(img_rgb, axis=0), 192, 192
    )
    input_img = tf.cast(input_img, dtype=tf.int32)
    
    # Run inference
    outputs = movenet(input_img)
    keypoints_raw = outputs["output_0"][0][0].numpy()
    
    # Convert to normalized format (x, y, score)
    h, w = frame.shape[:2]
    keypoints = []
    
    for i, (y, x, score) in enumerate(keypoints_raw):
        keypoints.append({
            'x': float(x),  # Normalized x (0-1)
            'y': float(y),  # Normalized y (0-1)
            'score': float(score),
            'name': KEYPOINT_NAMES[i] if i < len(KEYPOINT_NAMES) else f'keypoint_{i}'
        })
    
    return keypoints

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': movenet is not None
    })

@app.route('/process-video', methods=['POST'])
def process_video():
    """
    Process uploaded video: extract frames and detect poses.
    
    Request:
        - multipart/form-data with 'video' file
    
    Response:
        {
            'success': bool,
            'frames': [
                {
                    'frameNumber': int,
                    'timestamp': int (ms),
                    'keypoints': [{x, y, score, name}, ...]
                },
                ...
            ],
            'videoInfo': {
                'fps': float,
                'duration': int (ms),
                'totalFrames': int
            }
        }
    """
    if movenet is None:
        return jsonify({
            'success': False,
            'error': 'MoveNet model not loaded'
        }), 500
    
    if 'video' not in request.files:
        return jsonify({
            'success': False,
            'error': 'No video file provided'
        }), 400
    
    file = request.files['video']
    if file.filename == '':
        return jsonify({
            'success': False,
            'error': 'No file selected'
        }), 400
    
    if not allowed_file(file.filename):
        return jsonify({
            'success': False,
            'error': f'File type not allowed. Allowed: {ALLOWED_EXTENSIONS}'
        }), 400
    
    # Save uploaded file temporarily
    filename = secure_filename(file.filename)
    temp_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    try:
        file.save(temp_path)
        file_size = os.path.getsize(temp_path)
        print(f"📥 Video saved to: {temp_path}")
        print(f"📊 File size: {file_size / (1024*1024):.2f} MB")
        
        # Extract frames
        frames, fps, duration_ms = extract_frames(temp_path, frame_rate=10)
        
        if len(frames) == 0:
            print("⚠️ Warning: No frames extracted from video")
            return jsonify({
                'success': False,
                'error': 'No frames could be extracted from the video. The file might be corrupted or invalid.'
            }), 400
        
        # Process each frame with pose detection
        processed_frames = []
        for frame_number, timestamp_ms, frame in frames:
            keypoints = detect_pose_in_frame(frame)
            processed_frames.append({
                'frameNumber': frame_number,
                'timestamp': timestamp_ms,
                'keypoints': keypoints
            })
        
        print(f"✅ Processed {len(processed_frames)} frames")
        
        # Clean up temp file
        os.remove(temp_path)
        
        return jsonify({
            'success': True,
            'frames': processed_frames,
            'videoInfo': {
                'fps': float(fps),
                'duration': duration_ms,
                'totalFrames': len(processed_frames)
            }
        })
        
    except Exception as e:
        # Clean up temp file on error
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        print(f"❌ Error processing video: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    import sys
    # Use port 5001 by default (5000 is often used by AirPlay on macOS)
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5001
    
    print("🚀 Starting ParVision API server...")
    print(f"📁 Upload folder: {UPLOAD_FOLDER}")
    print(f"📦 Max file size: {MAX_FILE_SIZE / (1024*1024):.0f}MB")
    print(f"🌐 Server running on http://0.0.0.0:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
