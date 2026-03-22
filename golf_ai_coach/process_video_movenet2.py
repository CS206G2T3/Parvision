import cv2
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub

# Load MoveNet Thunder model
model = hub.load("https://tfhub.dev/google/movenet/singlepose/thunder/4")
movenet = model.signatures["serving_default"]

# Skeleton edges
EDGES = {
    (0, 1), (0, 2),
    (1, 3), (2, 4),
    (0, 5), (0, 6),
    (5, 7), (7, 9),
    (6, 8), (8, 10),
    (5, 6),
    (5, 11), (6, 12),
    (11, 12),
    (11, 13), (13, 15),
    (12, 14), (14, 16)
}

# Draw functions
def draw_keypoints(frame, keypoints, threshold=0.5):
    h, w, _ = frame.shape
    for kp in keypoints:
        y, x, conf = kp
        if conf > threshold:
            cx, cy = int(x * w), int(y * h)
            cv2.circle(frame, (cx, cy), 5, (0, 255, 0), -1)

def draw_connections(frame, keypoints, edges, threshold=0.5):
    h, w, _ = frame.shape
    for p1, p2 in edges:
        y1, x1, c1 = keypoints[p1]
        y2, x2, c2 = keypoints[p2]
        if c1 > threshold and c2 > threshold:
            cv2.line(
                frame,
                (int(x1 * w), int(y1 * h)),
                (int(x2 * w), int(y2 * h)),
                (255, 0, 0),
                2
            )

# Video paths
input_video_path = "input7.mp4"
output_video_path = "output_with_skeleton7.mp4"

cap = cv2.VideoCapture(input_video_path)

if not cap.isOpened():
    print("ERROR: Cannot open video")
    exit()

width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = int(cap.get(cv2.CAP_PROP_FPS))

fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))

print("Processing video...")

# Smoothing setup
prev_keypoints = None
alpha = 0.7  # smoothing strength

frame_count = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Crop to center
    h, w, _ = frame.shape
    crop = frame[int(h*0.2):int(h*0.9), int(w*0.2):int(w*0.8)]

    # Improve brightness
    img = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
    img = cv2.convertScaleAbs(img, alpha=1.3, beta=20)

    # Resize for model
    input_img = tf.image.resize_with_pad(
        tf.expand_dims(img, axis=0), 256, 256
    )
    input_img = tf.cast(input_img, dtype=tf.int32)

    # Run MoveNet
    outputs = movenet(input_img)
    keypoints = outputs["output_0"][0][0].numpy()

    # Smooth keypoints
    if prev_keypoints is not None:
        keypoints = alpha * prev_keypoints + (1 - alpha) * keypoints
    prev_keypoints = keypoints

    # Draw on cropped frame
    draw_connections(crop, keypoints, EDGES)
    draw_keypoints(crop, keypoints)

    # Put cropped frame back into original
    frame[int(h*0.2):int(h*0.9), int(w*0.2):int(w*0.8)] = crop

    # Write frame
    out.write(frame)

    frame_count += 1
    if frame_count % 10 == 0:
        print(f"Processed {frame_count} frames")

cap.release()
out.release()

print("Done! Saved as:", output_video_path)