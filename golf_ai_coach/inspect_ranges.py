import pandas as pd

df = pd.read_csv("data/preprocessed_CaddieSet.csv")

columns = [
    "DirectionAngle",
    "0-SHOULDER-ANGLE",
    "0-STANCE-RATIO",
    "1-HIP-ROTATION",
    "1-HIP-SHIFTED",
    "3-HIP-SHIFTED",
    "3-RIGHT-LEG-ANGLE",
    "6-WEIGHT-SHIFT",
    "7-FINISH-ANGLE"
]

print(df[columns].describe())