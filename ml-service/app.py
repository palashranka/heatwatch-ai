from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import joblib
import uvicorn

app = FastAPI()

# Load model
model = joblib.load('heatwave_risk_model.pkl')

class PredictionRequest(BaseModel):
    temperature: float
    humidity: float
    population: int
    elderly_percent: float
    literacy_rate: float

class BulkPredictionRequest(BaseModel):
    predictions: List[PredictionRequest]

@app.get("/")
def root():
    return {"message": "ML Service Running", "status": "ok"}

@app.post("/predict")
def predict(data: PredictionRequest):
    """Predict risk for single input"""
    features = [[
        data.temperature,
        data.humidity,
        data.population,
        data.elderly_percent,
        data.literacy_rate
    ]]
    risk = int(model.predict(features)[0])
    
    risk_labels = {0: "Caution", 1: "Extreme Caution", 2: "Danger", 3: "Extreme Danger"}
    colors = {0: '#4ade80', 1: '#fbbf24', 2: '#fb923c', 3: '#ef4444'}
    
    return {
        "risk_level": risk,
        "risk_label": risk_labels[risk],
        "color": colors[risk]
    }

@app.post("/predict-bulk")
def predict_bulk(data: BulkPredictionRequest):
    """Predict risk for multiple inputs"""
    features = []
    for pred in data.predictions:
        features.append([
            pred.temperature,
            pred.humidity,
            pred.population,
            pred.elderly_percent,
            pred.literacy_rate
        ])
    
    predictions = model.predict(features)
    risk_labels = {0: "Caution", 1: "Extreme Caution", 2: "Danger", 3: "Extreme Danger"}
    colors = {0: '#4ade80', 1: '#fbbf24', 2: '#fb923c', 3: '#ef4444'}
    
    return {
        "predictions": [
            {
                "risk_level": int(p), 
                "risk_label": risk_labels[int(p)],
                "color": colors[int(p)]
            } 
            for p in predictions
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)