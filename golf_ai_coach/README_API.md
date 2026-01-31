# ParVision Video Processing API

Server-side API for processing golf videos with MoveNet pose detection.

## Setup

1. Install dependencies:
```bash
cd golf_ai_coach
pip install -r requirements.txt
```

2. Start the server:
```bash
python api_server.py
```

The server will start on `http://localhost:5001` (port 5000 is often used by AirPlay on macOS)

## API Endpoints

### Health Check
```
GET /health
```

Returns:
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### Process Video
```
POST /process-video
Content-Type: multipart/form-data
```

**Request:**
- Form field: `video` (file upload)
- Supported formats: `.mp4`, `.mov`, `.avi`, `.mkv`
- Max file size: 100MB

**Response:**
```json
{
  "success": true,
  "frames": [
    {
      "frameNumber": 0,
      "timestamp": 0,
      "keypoints": [
        {
          "x": 0.5,
          "y": 0.15,
          "score": 0.9,
          "name": "nose"
        },
        ...
      ]
    },
    ...
  ],
  "videoInfo": {
    "fps": 30.0,
    "duration": 5000,
    "totalFrames": 50
  }
}
```

## Usage with React Native App

The frontend automatically sends videos to `http://localhost:5000/process-video` when a video is uploaded.

For production, update the `API_URL` in `VideoAnalysisScreen.js`:
```javascript
const API_URL = 'https://your-api-domain.com/process-video';
```

**Note:** The server uses port 5001 by default to avoid conflicts with macOS AirPlay Receiver (which uses port 5000). You can specify a different port:
```bash
python api_server.py 8080  # Use port 8080 instead
```

## Notes

- The API extracts frames at 10 FPS (configurable in `extract_frames()`)
- MoveNet Lightning model is loaded once at startup
- Temporary video files are automatically cleaned up after processing
- CORS is enabled for React Native app access
