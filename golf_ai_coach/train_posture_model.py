import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix

# Load labeled data
df = pd.read_csv("data/posture_labeled.csv")

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

X = df[FEATURES]
y = df["label"]

# Train / test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.25,
    random_state=42,
    stratify=y
)

# Train Random Forest
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    min_samples_leaf=5,
    random_state=42
)

model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)

print("\n Classification Report:\n")
print(classification_report(y_test, y_pred))

print(" Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# Feature importance
importances = pd.Series(
    model.feature_importances_,
    index=FEATURES
).sort_values(ascending=False)

print("\n Feature Importance:")
print(importances)

# Save model
joblib.dump(model, "models/posture_rf_model.pkl")
print("\n Model saved to models/posture_rf_model.pkl")
