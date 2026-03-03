import cv2
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
import joblib
import math
import pandas as pd

# Load trained 3-class model
model = joblib.load("models/posture_3class_model.pkl")

# Load MoveNet
movenet_model = hub.load(
    "https://tfhub.dev/google/movenet/singlepose/lightning/4"
)
movenet = movenet_model.signatures["serving_default"]

FEATURE_NAMES = [
    "0-SHOULDER-ANGLE",
    "0-STANCE-RATIO",
    "1-HIP-ROTATION",
    "1-HIP-SHIFTED",
    "1-LEFT-ARM-ANGLE",
    "1-RIGHT-ARM-ANGLE",
    "3-HIP-SHIFTED",
    "3-RIGHT-LEG-ANGLE",
    "4-RIGHT-ARMPIT-ANGLE",
    "5-LEFT-ARM-ANGLE",
    "5-RIGHT-ARM-ANGLE",
    "6-WEIGHT-SHIFT",
    "7-FINISH-ANGLE"
]

# Keypoint indices
LS, RS = 5, 6
LE, RE = 7, 8
LW, RW = 9, 10
LH, RH = 11, 12
LK, RK = 13, 14
LA, RA = 15, 16

# Skeleton edges (FULL BODY)
EDGES = [
    (5, 6),     # shoulders
    (5, 7), (7, 9),    # left arm
    (6, 8), (8, 10),   # right arm
    (5, 11), (6, 12),  # torso
    (11, 12),          # hips
    (11, 13), (13, 15),# left leg
    (12, 14), (14, 16)# right leg
]

def draw_skeleton(frame, keypoints, conf=0.3):
    h, w, _ = frame.shape
    for p1, p2 in EDGES:
        y1, x1, c1 = keypoints[p1]
        y2, x2, c2 = keypoints[p2]
        if c1 > conf and c2 > conf:
            cv2.line(
                frame,
                (int(x1 * w), int(y1 * h)),
                (int(x2 * w), int(y2 * h)),
                (0, 255, 255),
                2
            )

# Math helpers
def angle(a, b, c):
    ba = np.array([a[0] - b[0], a[1] - b[1], 0.0])
    bc = np.array([c[0] - b[0], c[1] - b[1], 0.0])

    cosang = np.dot(ba, bc)
    sinang = np.linalg.norm(np.cross(ba, bc))
    return abs(np.degrees(np.arctan2(sinang, cosang)))

def xy(kp, i):
    return (kp[i][1], kp[i][0])

# Feature extraction
def extract_features(kp):
    ls, rs = xy(kp, LS), xy(kp, RS)
    le, re = xy(kp, LE), xy(kp, RE)
    lw, rw = xy(kp, LW), xy(kp, RW)
    lh, rh = xy(kp, LH), xy(kp, RH)
    rk = xy(kp, RK)
    la, ra = xy(kp, LA), xy(kp, RA)

    # 0 - Setup
    shoulder_angle = abs(math.degrees(math.atan2(
        rs[1] - ls[1], rs[0] - ls[0]
    )))

    stance_ratio = math.dist(la, ra) / max(math.dist(ls, rs), 1e-6)

    # 1 - Backswing
    hip_rotation = abs(math.degrees(math.atan2(
        rh[1] - lh[1], rh[0] - lh[0]
    )))

    hip_center_x = (lh[0] + rh[0]) / 2
    ankle_center_x = (la[0] + ra[0]) / 2
    hip_shifted_1 = hip_center_x - ankle_center_x

    left_arm_angle_1 = angle(ls, le, lw)
    right_arm_angle_1 = angle(rs, re, rw)

    # 3 - Downswing
    hip_shifted_3 = hip_shifted_1
    right_leg_angle = angle(rh, rk, ra)

    # 4 - Arm structure
    right_armpit_angle = angle(rs, re, rh)

    # 5 - Arms at finish (proxy)
    left_arm_angle_5 = left_arm_angle_1
    right_arm_angle_5 = right_arm_angle_1

    # 6 - Weight shift
    weight_shift = abs(hip_center_x - la[0]) * 100

    # 7 - Finish angle
    torso_mid = ((ls[0] + rs[0]) / 2, (ls[1] + rs[1]) / 2)
    finish_angle = angle(torso_mid, lh, la)

    values = [
        shoulder_angle,
        stance_ratio,
        hip_rotation,
        hip_shifted_1,
        left_arm_angle_1,
        right_arm_angle_1,
        hip_shifted_3,
        right_leg_angle,
        right_armpit_angle,
        left_arm_angle_5,
        right_arm_angle_5,
        weight_shift,
        finish_angle
    ]
    return pd.DataFrame([values], columns=FEATURE_NAMES)


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
    input_img = tf.cast(input_img, tf.int32)

    kp = movenet(input_img)["output_0"][0][0].numpy()
    draw_skeleton(frame, kp)

    try:
        features = extract_features(kp)
        label = model.predict(features)[0]

        if label == "good":
            text, color = "GOOD POSTURE", (0, 255, 0)
        elif label == "okay":
            text, color = "OKAY POSTURE", (0, 255, 255)
        else:
            text, color = "BAD POSTURE", (0, 0, 255)

        cv2.putText(frame, text, (30, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.2, color, 3)
    except:
        pass

    cv2.imshow("ParVision AI Coach", frame)
    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()