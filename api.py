
import pandas as pd
import joblib
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os

# Initialize FastAPI app
app = FastAPI(title="Heart Disease Prediction API")

# Define Input Schema
class HeartDiseaseInput(BaseModel):
    age: float
    sex: float
    cp: float
    trestbps: float
    chol: float
    fbs: float
    restecg: float
    thalach: float
    exang: float
    oldpeak: float
    slope: float
    ca: float
    thal: float

# Global variables for model, scaler, and metadata
model = None
scaler = None
metadata = None

@app.on_event("startup")
def load_artifacts():
    global model, scaler, metadata
    try:
        model_path = "data/logistic_model.joblib"
        scaler_path = "data/scaler.joblib"
        metadata_path = "data/metadata.json"
        
        if os.path.exists(model_path) and os.path.exists(scaler_path):
            model = joblib.load(model_path)
            scaler = joblib.load(scaler_path)
            print("Model and Scaler loaded successfully.")
        else:
            print("Error: Model or Scaler file not found. Please run training script first.")
            
        if os.path.exists(metadata_path):
            with open(metadata_path, "r") as f:
                metadata = json.load(f)
            print("Metadata loaded successfully.")
        else:
            print("Warning: Metadata file not found.")
            
    except Exception as e:
        print(f"Error loading artifacts: {e}")

@app.get("/")
def home():
    return {"message": "Heart Disease Prediction API is running."}

@app.post("/predict")
def predict(data: HeartDiseaseInput):
    if not model or not scaler:
        raise HTTPException(status_code=500, detail="Model not loaded.")
    
    try:
        # Convert input to DataFrame
        input_data = pd.DataFrame([data.dict().values()], columns=data.dict().keys())
        
        # Scale the data
        scaled_data = scaler.transform(input_data)
        
        # Predict probability
        probability = model.predict_proba(scaled_data)[0][1]
        
        # Predict class
        prediction = model.predict(scaled_data)[0]
        
        result = {
            "risk": "high" if prediction == 1 else "low",
            "probability": float(probability),
            "input_summary": data.dict(),
            "model_info": metadata or {}
        }
        return result

    except Exception as e:
        print(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
