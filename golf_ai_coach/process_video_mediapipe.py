import cv2
import mediapipe as mp

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
mp_draw = mp.solutions.drawing_utils

pose = mp_pose.Pose(
    static_image_mode=False,      
    model_complexity=2,           # 2 = most accurate
    enable_segmentation=False,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Video paths
input_video_path = "input5.mp4"
output_video_path = "output_mediapipe5.mp4"

cap = cv2.VideoCapture(input_video_path)

if not cap.isOpened():
    print("ERROR: Cannot open video")
    exit()

# Get video properties
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = int(cap.get(cv2.CAP_PROP_FPS))

# Output writer
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))

print("Processing video with MediaPipe...")

frame_count = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Improve brightness
    frame = cv2.convertScaleAbs(frame, alpha=1.2, beta=15)

    # Convert to RGB
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Process frame
    results = pose.process(rgb)

    # Draw skeleton
    if results.pose_landmarks:
        mp_draw.draw_landmarks(
            frame,
            results.pose_landmarks,
            mp_pose.POSE_CONNECTIONS,
            mp_draw.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
            mp_draw.DrawingSpec(color=(0, 0, 255), thickness=2)
        )

    # Write frame
    out.write(frame)

    frame_count += 1
    if frame_count % 10 == 0:
        print(f"Processed {frame_count} frames")

cap.release()
out.release()
pose.close()

print("Done! Saved as:", output_video_path)