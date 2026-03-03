import pandas as pd

df = pd.read_csv("data/preprocessed_CaddieSet.csv")

def posture_score(row):
    score = 0

    # ===== Setup =====
    if 15 <= row["0-SHOULDER-ANGLE"] <= 70:
        score += 1
    if 0.9 <= row["0-STANCE-RATIO"] <= 1.6:
        score += 1

    # ===== Backswing =====
    if row["1-HIP-ROTATION"] >= 8:
        score += 1
    if abs(row["1-HIP-SHIFTED"]) <= 0.5:
        score += 1

    # Arms at takeaway (loose check)
    if 60 <= row["1-LEFT-ARM-ANGLE"] <= 140:
        score += 0.5
    if 60 <= row["1-RIGHT-ARM-ANGLE"] <= 140:
        score += 0.5

    # ===== Downswing =====
    if row["3-HIP-SHIFTED"] >= -0.1:
        score += 1
    if row["3-RIGHT-LEG-ANGLE"] >= 130:
        score += 1

    # ===== Follow-through =====
    if row["6-WEIGHT-SHIFT"] >= 0.35:
        score += 1
    if row["7-FINISH-ANGLE"] >= 130:
        score += 1

    # Arms at finish
    if 70 <= row["5-LEFT-ARM-ANGLE"] <= 160:
        score += 0.5
    if 70 <= row["5-RIGHT-ARM-ANGLE"] <= 160:
        score += 0.5

    # Chicken wing penalty
    if row["4-RIGHT-ARMPIT-ANGLE"] < 20:
        score -= 1

    return score


def label_row(row):
    posture = posture_score(row)
    direction = abs(row["DirectionAngle"])

    # ===== BAD =====
    if posture < 5 and direction >= 5:
        return "bad"

    # ===== GOOD =====
    if posture >= 6 and direction <= 2:
        return "good"

    # ===== OKAY =====
    return "okay"


df["label"] = df.apply(label_row, axis=1)

print(df["label"].value_counts())

df.to_csv("data/preprocessed_CaddieSet_3class.csv", index=False)
print("Saved: data/preprocessed_CaddieSet_3class.csv")