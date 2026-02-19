import { NextResponse } from "next/server"

interface PredictionRequest {
  age: number
  sex: number
  cp: number
  trestbps: number
  chol: number
  fbs: number
  restecg: number
  thalach: number
  exang: number
  oldpeak: number
  slope: number
  ca: number
  thal: number
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PredictionRequest

    // Basic validation to ensure all fields are present
    const requiredFields = [
      "age", "sex", "cp", "trestbps", "chol", "fbs",
      "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"
    ]

    for (const field of requiredFields) {
      if (body[field as keyof PredictionRequest] === undefined) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Forward request to Python API
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Python API Error:", errorData)
      return NextResponse.json(
        { error: "Error from prediction service." },
        { status: response.status }
      )
    }

    const result = await response.json()

    // Format response to match frontend expectations
    // existing frontend expects: risk, probability, confidence, model_info, input_summary
    return NextResponse.json({
      risk: result.risk,
      probability: Math.round(result.probability * 1000) / 10, // Convert 0.123 to 12.3
      confidence: Math.round(
        (result.risk === "high" ? result.probability : 1 - result.probability) *
        1000
      ) / 10,
      model_info: {
        algorithm: "Logistic Regression (13 features)",
        backend: "Scikit-Learn + FastAPI",
        accuracy: result.model_info?.accuracy ? Math.round(result.model_info.accuracy * 100) : undefined,
        training_samples: result.model_info?.training_samples,
      },
      input_summary: result.input_summary,
    })

  } catch (err) {
    console.error("Prediction error:", err)
    return NextResponse.json(
      { error: "An error occurred during prediction." },
      { status: 500 }
    )
  }
}

