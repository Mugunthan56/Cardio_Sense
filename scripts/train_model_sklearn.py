
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import json
import os

# Define constants
DATA_URL = "https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data"
COLUMN_NAMES = [
    "age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", 
    "thalach", "exang", "oldpeak", "slope", "ca", "thal", "target"
]
MODEL_PATH = "data/logistic_model.joblib"
SCALER_PATH = "data/scaler.joblib"

def load_data():
    """Lengths the Cleveland Heart Disease dataset from UCI."""
    print("Loading dataset...")
    try:
        # Load dataset handling '?' as NaN
        df = pd.read_csv(DATA_URL, names=COLUMN_NAMES, na_values="?")
        print(f"Dataset loaded with {df.shape[0]} rows and {df.shape[1]} columns.")
        return df
    except Exception as e:
        print(f"Error loading dataset: {e}")
        return None

def preprocess_data(df):
    """Preprocesses the dataset: handles missing values and scales features."""
    print("Preprocessing data...")
    
    # Drop rows with missing values
    initial_rows = len(df)
    df = df.dropna()
    print(f"Dropped {initial_rows - len(df)} rows with missing values.")

    # Validate we have enough data
    if len(df) == 0:
        raise ValueError("Dataset is empty after dropping missing values.")

    # Target: 0 = no disease, 1-4 = disease. Convert to binary (0/1).
    df['target'] = df['target'].apply(lambda x: 1 if x > 0 else 0)

    # Split features and target
    X = df.drop("target", axis=1)
    y = df["target"]

    return X, y

def train_model():
    """Main function to train the model with hyperparameter tuning."""
    
    # 1. Load Data
    df = load_data()
    if df is None:
        return

    # 2. Preprocess
    X, y = preprocess_data(df)

    # 3. Split Data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    print(f"Training set size: {X_train.shape[0]}, Test set size: {X_test.shape[0]}")

    # 4. Scale Data
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 5. Train using GridSearchCV
    print("Training Logistic Regression model with GridSearchCV...")
    
    # Define hyperparameter grid
    param_grid = {
        'C': [0.001, 0.01, 0.1, 1, 10, 100],
        'penalty': ['l2'],
        'solver': ['lbfgs', 'liblinear']
    }
    
    grid = GridSearchCV(LogisticRegression(max_iter=5000), param_grid, cv=5, scoring='accuracy')
    grid.fit(X_train_scaled, y_train)
    
    best_model = grid.best_estimator_
    print(f"Best hyperparameters: {grid.best_params_}")

    # 6. Evaluate
    y_pred = best_model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nModel Accuracy: {accuracy:.4f}")
    print("\nClassification Report:\n", classification_report(y_test, y_pred))
    print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))

    # 7. Save Model, Scaler, and Metadata
    if not os.path.exists("data"):
        os.makedirs("data")
        
    joblib.dump(best_model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    
    metadata = {
        "accuracy": float(accuracy),
        "best_params": grid.best_params_,
        "training_samples": len(X_train),
        "test_samples": len(X_test)
    }
    
    with open("data/metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"\nModel saved to {MODEL_PATH}")
    print(f"Scaler saved to {SCALER_PATH}")
    print(f"Metadata saved to data/metadata.json")

if __name__ == "__main__":
    train_model()
