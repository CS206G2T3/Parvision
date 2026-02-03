# Posture Rules:
# 0-SHOULDER-ANGLE:    30-55 degrees
# 0-STANCE-RATIO:     0.9-1.2
# 1-HIP-ROTATION:     ≥ 25 degrees
# 1-HIP-SHIFTED:      |value| ≤ 0.15
# 3-HIP-SHIFTED:      ≥ 0.2
# 3-RIGHT-LEG-ANGLE:  ≥ 150 degrees
# 6-WEIGHT-SHIFT:     ≥ 0.6
# 7-FINISH-ANGLE:     ≥ 160 degrees

import pandas as pd

df = pd.read_csv("data/preprocessed_CaddieSet.csv")

def posture_score(row):
    score = 0

    # Setup
    if 20 <= row["0-SHOULDER-ANGLE"] <= 65:
        score += 1

    if 0.8 <= row["0-STANCE-RATIO"] <= 1.3:
        score += 1

    # Backswing
    if row["1-HIP-ROTATION"] >= 15:
        score += 1

    if abs(row["1-HIP-SHIFTED"]) <= 0.3:
        score += 1

    # Downswing
    if row["3-HIP-SHIFTED"] >= 0.1:
        score += 1

    if row["3-RIGHT-LEG-ANGLE"] >= 140:
        score += 1

    # Follow-through
    if row["6-WEIGHT-SHIFT"] >= 0.5:
        score += 1

    if row["7-FINISH-ANGLE"] >= 150:
        score += 1

    return score


def label_row(row):
    score = posture_score(row)
    good_direction = abs(row["DirectionAngle"]) <= 5

    if good_direction and score >= 5:
        return "good"
    else:
        return "bad"


df["label"] = df.apply(label_row, axis=1)

df.to_csv("data/preprocessed_CaddieSet_labeled.csv", index=False)

print(df["label"].value_counts())
