import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix

# Load labeled data
df = pd.read_csv("data/preprocessed_CaddieSet_3class.csv")

# Features used for posture evaluation
FEATURES = [
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

X = df[FEATURES]
y = df["label"]

# Train / test split (stratified keeps class proportions)
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.25,
    random_state=42,
    stratify=y
)

# Random Forest posture coach
model = RandomForestClassifier(
    n_estimators=300,
    max_depth=10,
    class_weight="balanced",
    random_state=42
)

model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)

print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# Feature importance (VERY IMPORTANT for feedback later)
importances = pd.Series(
    model.feature_importances_,
    index=FEATURES
).sort_values(ascending=False)

print("\nFeature Importance:")
print(importances)

# Save model
joblib.dump(model, "models/posture_3class_model.pkl")
print("\nModel saved to models/posture_3class_model.pkl")