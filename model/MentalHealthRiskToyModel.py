# generated by ai obviously cus why would i write this myself

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.preprocessing import LabelEncoder

# Load the dataset
file_path = "dataset.csv"
data = pd.read_csv(file_path)

# Handle missing values (if any)
data = data.fillna("Unknown")

# Encode categorical variables
encoder_dict = {}
categorical_columns = [
    "Gender",
    "Job_Role",
    "Industry",
    "Work_Location",
    "Stress_Level",
    "Mental_Health_Condition",
    "Access_to_Mental_Health_Resources",
    "Satisfaction_with_Remote_Work",
    "Region",
    "Physical_Activity",
    "Sleep_Quality",
    "Productivity_Change",
]
for col in categorical_columns:
    encoder = LabelEncoder()
    data[col] = encoder.fit_transform(data[col])
    encoder_dict[col] = encoder  # Save encoder for future use

# Select features and target variable
X = data.drop(["Mental_Health_Condition", "Employee_ID"], axis=1)
y = data["Mental_Health_Condition"]

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train a Random Forest Classifier
clf = RandomForestClassifier(random_state=42)
clf.fit(X_train, y_train)

# Make predictions on test data
y_pred = clf.predict(X_test)

# Evaluate the model
print("Classification Report:\n", classification_report(y_test, y_pred))

# Example data for prediction
example_data = pd.DataFrame(
    {
        "Age": [30],
        "Gender": ["Male"],
        "Job_Role": ["Software Engineer"],
        "Industry": ["IT"],
        "Years_of_Experience": [5],
        "Work_Location": ["Remote"],
        "Hours_Worked_Per_Week": [40],
        "Number_of_Virtual_Meetings": [5],
        "Work_Life_Balance_Rating": [3],
        "Stress_Level": ["Medium"],
        "Access_to_Mental_Health_Resources": ["Yes"],
        "Productivity_Change": ["Increase"],
        "Social_Isolation_Rating": [2],
        "Satisfaction_with_Remote_Work": ["Satisfied"],
        "Company_Support_for_Remote_Work": [4],
        "Physical_Activity": ["Weekly"],
        "Sleep_Quality": ["Good"],
        "Region": ["North America"],
    }
)


# Encode the example data using the same encoders
for col in example_data.columns:
    if col in encoder_dict:
        encoder = encoder_dict[col]
        try:
            example_data[col] = encoder.transform(example_data[col])
        except ValueError:
            # Handle unseen labels by assigning a default label (e.g., the most frequent one)
            default_label = encoder.transform([encoder.classes_[0]])[0]
            example_data[col] = example_data[col].apply(
                lambda x: (
                    encoder.transform([x])[0]
                    if x in encoder.classes_
                    else default_label
                )
            )

# Make predictions for the example data
predictions = clf.predict(example_data)
predicted_conditions = encoder_dict["Mental_Health_Condition"].inverse_transform(
    predictions
)
print("\nPredicted Mental Health Conditions for Example Data:")
print(predicted_conditions)
