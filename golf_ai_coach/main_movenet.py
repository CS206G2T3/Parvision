import cv2
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub

# Load MoveNet model (Lightning)
model = hub.load("https://tfhub.dev/google/movenet/singlepose/thunder/4")
movenet = model.signatures["serving_default"]

# Keypoint connections (MoveNet skeleton)
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

def draw_keypoints(frame, keypoints, confidence_threshold=0.3):
    h, w, _ = frame.shape
    for kp in keypoints:
        y, x, conf = kp
        if conf > confidence_threshold:
            cx, cy = int(x * w), int(y * h)
            cv2.circle(frame, (cx, cy), 4, (0, 255, 0), -1)

def draw_connections(frame, keypoints, edges, confidence_threshold=0.3):
    h, w, _ = frame.shape
    for p1, p2 in edges:
        y1, x1, c1 = keypoints[p1]
        y2, x2, c2 = keypoints[p2]
        if c1 > confidence_threshold and c2 > confidence_threshold:
            cv2.line(
                frame,
                (int(x1 * w), int(y1 * h)),
                (int(x2 * w), int(y2 * h)),
                (255, 0, 0),
                2
            )

# Open webcam
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("ERROR: Could not open webcam")
    exit()

print("Press ESC to quit")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Resize and pad to MoveNet input
    input_img = tf.image.resize_with_pad(
        tf.expand_dims(img, axis=0), 256, 256
    )
    input_img = tf.cast(input_img, dtype=tf.int32)

    # Run inference
    outputs = movenet(input_img)
    keypoints = outputs["output_0"][0][0].numpy()

    # Draw skeleton
    draw_connections(frame, keypoints, EDGES)
    draw_keypoints(frame, keypoints)

    cv2.imshow("ParVision - MoveNet Pose", frame)

    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()