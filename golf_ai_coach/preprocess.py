import pandas as pd

# Step 1: Load the CSV file
file_path = 'data/CaddieSet.csv'
df = pd.read_csv(file_path)

# Step 2: Define the columns we want to keep
columns_to_keep = [
    'Distance', 'Carry', 'DirectionAngle', 'SpinBack', 'SpinSide', 'SpinAxis', 'BallSpeed',
    '0-SHOULDER-ANGLE', '0-STANCE-RATIO', '0-UPPER-TILT',
    '1-HEAD-LOC', '1-HIP-ROTATION', '1-HIP-SHIFTED', '1-LEFT-ARM-ANGLE', '1-RIGHT-ARM-ANGLE', '1-SHOULDER-LOC',
    '2-HEAD-LOC', '2-HIP-ROTATION', '2-HIP-SHIFTED', '2-LEFT-ARM-ANGLE', '2-SHOULDER-LOC', '2-UPPER-TILT',
    '3-HEAD-LOC', '3-HIP-ROTATION', '3-HIP-SHIFTED', '3-RIGHT-LEG-ANGLE', '3-SHOULDER-LOC',
    '4-HEAD-LOC', '4-HIP-HANGING-BACK', '4-HIP-ROTATION', '4-HIP-SHIFTED', '4-RIGHT-ARMPIT-ANGLE', '4-SHOULDER-HANGING-BACK',
    '5-HEAD-LOC', '5-HIP-HANGING-BACK', '5-HIP-SHIFTED', '5-LEFT-ARM-ANGLE', '5-RIGHT-ARM-ANGLE', '5-SHOULDER-ANGLE', '5-SHOULDER-HANGING-BACK',
    '6-HEAD-LOC', '6-HIP-SHIFTED', '6-LEFT-ARM-ANGLE', '6-RIGHT-LEG-ANGLE', '6-WEIGHT-SHIFT',
    '7-FINISH-ANGLE', '7-HIP-SHIFTED'
]

# Step 3: Filter the DataFrame to keep only the selected columns
df_filtered = df[columns_to_keep]

# Step 4: Drop rows with missing values in any column
df_cleaned = df_filtered.dropna()

# Step 5: Save the cleaned data to a new CSV file
output_path = 'data/preprocessed_CaddieSet.csv'
df_cleaned.to_csv(output_path, index=False)

print(f"Preprocessed data has been saved to {output_path}")