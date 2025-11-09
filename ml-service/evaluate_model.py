# evaluate_model.py
import pandas as pd
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib

# 1. Load your trained model
model = joblib.load("models/heatwave_model.pkl")

# 2. Load your test dataset
data = pd.read_csv("data/test.csv")

# 3. Split into features and labels
X = data[["temperature", "humidity", "population", "elderly_percent", "literacy_rate"]]
y_true = data["actual_risk_level"]

# 4. Make predictions
y_pred = model.predict(X)

# 5. Evaluate accuracy
print("✅ Model Evaluation Results:")
print("--------------------------------------")
print(f"Accuracy: {accuracy_score(y_true, y_pred) * 100:.2f}%")
print("\nClassification Report:")
print(classification_report(y_true, y_pred, digits=2))
print("\nConfusion Matrix:")
print(confusion_matrix(y_true, y_pred))
