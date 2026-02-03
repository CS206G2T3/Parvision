import cv2
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
import joblib
import math

# Load trained posture model
model = joblib.load("models/posture_rf_model.pkl")

FEATURE_NAMES = [
    "0-SHOULDER-ANGLE",
    "0-STANCE-RATIO",
    "1-HIP-ROTATION",
    "1-HIP-SHIFTED",
    "3-HIP-SHIFTED",
    "3-RIGHT-LEG-ANGLE",
    "6-WEIGHT-SHIFT",
    "7-FINISH-ANGLE"
]

# Load MoveNet
movenet_model = hub.load(
    "https://tfhub.dev/google/movenet/singlepose/lightning/4"
)
movenet = movenet_model.signatures["serving_default"]

# Keypoint indices
LEFT_SHOULDER = 5
RIGHT_SHOULDER = 6
LEFT_HIP = 11
RIGHT_HIP = 12
LEFT_ANKLE = 15
RIGHT_ANKLE = 16

# Helper math functions
def angle_between(p1, p2):
    dx = p2[0] - p1[0]
    dy = p2[1] - p1[1]
    return abs(math.degrees(math.atan2(dy, dx)))

def distance(p1, p2):
    return math.dist(p1, p2)

# Extract posture features
def extract_features(keypoints):
    # Extract (x, y)
    def xy(i):
        return (keypoints[i][1], keypoints[i][0])

    ls = xy(LEFT_SHOULDER)
    rs = xy(RIGHT_SHOULDER)
    lh = xy(LEFT_HIP)
    rh = xy(RIGHT_HIP)
    la = xy(LEFT_ANKLE)
    ra = xy(RIGHT_ANKLE)

    # Shoulder angle
    shoulder_angle = angle_between(ls, rs)

    # Stance ratio
    stance_width = distance(la, ra)
    shoulder_width = distance(ls, rs)
    stance_ratio = stance_width / shoulder_width if shoulder_width > 0 else 0

    # Hip rotation
    hip_rotation = angle_between(lh, rh)

    # Hip shifted (lateral)
    hip_center_x = (lh[0] + rh[0]) / 2
    ankle_center_x = (la[0] + ra[0]) / 2
    hip_shifted = hip_center_x - ankle_center_x

    # Downswing hip shift (reuse same metric for now)
    downswing_hip_shift = hip_shifted

    # Right leg angle
    right_leg_angle = angle_between(rh, ra)

    # Weight shift (how far hips are over lead foot)
    weight_shift = abs(hip_center_x - la[0])

    # Finish angle (torso vs vertical)
    torso_mid = ((ls[0] + rs[0]) / 2, (ls[1] + rs[1]) / 2)
    finish_angle = angle_between(torso_mid, lh)

    features = np.array([
        shoulder_angle,
        stance_ratio,
        hip_rotation,
        hip_shifted,
        downswing_hip_shift,
        right_leg_angle,
        weight_shift * 100,   # scale similar to dataset
        finish_angle
    ])

    return features.reshape(1, -1)

# Draw skeleton
EDGES = [
    (5, 6), (5, 11), (6, 12),
    (11, 12), (11, 15), (12, 16)
]

def draw_skeleton(frame, keypoints):
    h, w, _ = frame.shape
    for p1, p2 in EDGES:
        y1, x1, c1 = keypoints[p1]
        y2, x2, c2 = keypoints[p2]
        if c1 > 0.3 and c2 > 0.3:
            cv2.line(
                frame,
                (int(x1 * w), int(y1 * h)),
                (int(x2 * w), int(y2 * h)),
                (255, 255, 255),
                2
            )

# Webcam loop
cap = cv2.VideoCapture(0)
print("Press ESC to quit")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    input_img = tf.image.resize_with_pad(
        tf.expand_dims(img, axis=0), 192, 192
    )
    input_img = tf.cast(input_img, dtype=tf.int32)

    outputs = movenet(input_img)
    keypoints = outputs["output_0"][0][0].numpy()

    draw_skeleton(frame, keypoints)

    try:
        features = extract_features(keypoints)
        prediction = model.predict(features)[0]

        if prediction == "good":
            text = "GOOD POSTURE"
            color = (0, 255, 0)
        else:
            text = "POSTURE NEEDS WORK"
            color = (0, 0, 255)

        cv2.putText(
            frame,
            text,
            (30, 50),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.2,
            color,
            3
        )
    except:
        pass

    cv2.imshow("ParVision AI Coach", frame)

    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()