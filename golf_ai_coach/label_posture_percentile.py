import pandas as pd
import numpy as np

df = pd.read_csv("data/preprocessed_CaddieSet.csv")

FEATURES = [
    "0-SHOULDER-ANGLE",
    "0-STANCE-RATIO",
    "1-HIP-ROTATION",
    "1-HIP-SHIFTED",
    "3-HIP-SHIFTED",
    "3-RIGHT-LEG-ANGLE",
    "6-WEIGHT-SHIFT",
    "7-FINISH-ANGLE"
]

# Compute percentiles
percentiles = {}
for col in FEATURES:
    percentiles[col] = {
        "low": df[col].quantile(0.2),
        "high": df[col].quantile(0.8)
    }

def posture_score(row):
    score = 0
    for col in FEATURES:
        low = percentiles[col]["low"]
        high = percentiles[col]["high"]

        if col in ["1-HIP-SHIFTED"]:
            if abs(row[col]) <= abs(high):
                score += 1
        else:
            if low <= row[col] <= high:
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

df.to_csv("data/posture_labeled.csv", index=False)

print(df["label"].value_counts())
