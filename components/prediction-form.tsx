"use client"

import { useState } from "react"
import { Activity, Droplets, Heart, User, Ruler, Zap, Gauge, Stethoscope } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ResultCard } from "@/components/result-card"

interface FormData {
  age: string
  sex: string
  cp: string
  trestbps: string
  chol: string
  fbs: string
  restecg: string
  thalach: string
  exang: string
  oldpeak: string
  slope: string
  ca: string
  thal: string
}

export interface PredictionResult {
  risk: "high" | "low"
  probability: number
  confidence: number
  model_info: {
    algorithm: string
    dataset: string
    training_samples: number
    accuracy: number
  }
}

export function PredictionForm() {
  const [formData, setFormData] = useState<FormData>({
    age: "",
    sex: "",
    cp: "",
    trestbps: "",
    chol: "",
    fbs: "",
    restecg: "",
    thalach: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    resetResult()
  }

  const handleSelectChange = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    resetResult()
  }

  const resetResult = () => {
    if (hasAnalyzed) {
      setResult(null)
      setError(null)
      setHasAnalyzed(false)
    }
  }

  const isFormValid = Object.values(formData).every((value) => value !== "")

  const handlePredict = async () => {
    if (!isFormValid) return

    setIsLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: Number(formData.age),
          sex: Number(formData.sex),
          cp: Number(formData.cp),
          trestbps: Number(formData.trestbps),
          chol: Number(formData.chol),
          fbs: Number(formData.fbs),
          restecg: Number(formData.restecg),
          thalach: Number(formData.thalach),
          exang: Number(formData.exang),
          oldpeak: Number(formData.oldpeak),
          slope: Number(formData.slope),
          ca: Number(formData.ca),
          thal: Number(formData.thal),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Prediction failed. Please try again.")
        return
      }

      setResult(data as PredictionResult)
    } catch {
      setError("Could not reach the prediction server. Please try again.")
    } finally {
      setHasAnalyzed(true)
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Input Section */}
      <Card className="border-border/60 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-lg text-foreground">
            Patient Analysis Form
          </CardTitle>
          <CardDescription>
            Enter all 13 clinical parameters required by the UCI Cleveland model.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Section 1: Demographics */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Demographics</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="age" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <User className="h-3.5 w-3.5 text-primary" /> Age
                </Label>
                <div className="relative">
                  <Input id="age" type="number" placeholder="e.g. 45" value={formData.age} onChange={handleChange("age")} />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">years</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sex" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <User className="h-3.5 w-3.5 text-primary" /> Sex
                </Label>
                <Select value={formData.sex} onValueChange={handleSelectChange("sex")}>
                  <SelectTrigger id="sex">
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Male</SelectItem>
                    <SelectItem value="0">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-border/50" />

          {/* Section 2: Basic Vitals */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Basic Vitals</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="trestbps" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Activity className="h-3.5 w-3.5 text-primary" /> Resting BP (trestbps)
                </Label>
                <div className="relative">
                  <Input id="trestbps" type="number" placeholder="e.g. 120" value={formData.trestbps} onChange={handleChange("trestbps")} />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">mm Hg</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chol" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Droplets className="h-3.5 w-3.5 text-primary" /> Cholesterol (chol)
                </Label>
                <div className="relative">
                  <Input id="chol" type="number" placeholder="e.g. 200" value={formData.chol} onChange={handleChange("chol")} />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">mg/dL</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fbs" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Droplets className="h-3.5 w-3.5 text-primary" /> Fasting BS &gt; 120 (fbs)
                </Label>
                <Select value={formData.fbs} onValueChange={handleSelectChange("fbs")}>
                  <SelectTrigger id="fbs">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">True (&gt; 120 mg/dL)</SelectItem>
                    <SelectItem value="0">False (&lt;= 120 mg/dL)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="restecg" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Activity className="h-3.5 w-3.5 text-primary" /> Resting ECG (restecg)
                </Label>
                <Select value={formData.restecg} onValueChange={handleSelectChange("restecg")}>
                  <SelectTrigger id="restecg">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Normal</SelectItem>
                    <SelectItem value="1">ST-T Wave Abnormality</SelectItem>
                    <SelectItem value="2">Left Ventricular Hypertrophy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thalach" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Heart className="h-3.5 w-3.5 text-primary" /> Max Heart Rate (thalach)
                </Label>
                <div className="relative">
                  <Input id="thalach" type="number" placeholder="e.g. 150" value={formData.thalach} onChange={handleChange("thalach")} />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">bpm</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-border/50" />

          {/* Section 3: Advanced Metrics */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Advanced Metrics</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cp" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Stethoscope className="h-3.5 w-3.5 text-primary" /> Chest Pain Type (cp)
                </Label>
                <Select value={formData.cp} onValueChange={handleSelectChange("cp")}>
                  <SelectTrigger id="cp">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Typical Angina</SelectItem>
                    <SelectItem value="2">Atypical Angina</SelectItem>
                    <SelectItem value="3">Non-anginal Pain</SelectItem>
                    <SelectItem value="4">Asymptomatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exang" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Zap className="h-3.5 w-3.5 text-primary" /> Exercise Angina (exang)
                </Label>
                <Select value={formData.exang} onValueChange={handleSelectChange("exang")}>
                  <SelectTrigger id="exang">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Yes</SelectItem>
                    <SelectItem value="0">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="oldpeak" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Gauge className="h-3.5 w-3.5 text-primary" /> ST Depression (oldpeak)
                </Label>
                <div className="relative">
                  <Input id="oldpeak" type="number" step="0.1" placeholder="e.g. 1.0" value={formData.oldpeak} onChange={handleChange("oldpeak")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slope" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Ruler className="h-3.5 w-3.5 text-primary" /> ST Slope (slope)
                </Label>
                <Select value={formData.slope} onValueChange={handleSelectChange("slope")}>
                  <SelectTrigger id="slope">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Upsloping</SelectItem>
                    <SelectItem value="2">Flat</SelectItem>
                    <SelectItem value="3">Downsloping</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ca" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Droplets className="h-3.5 w-3.5 text-primary" /> Major Vessels (ca)
                </Label>
                <Select value={formData.ca} onValueChange={handleSelectChange("ca")}>
                  <SelectTrigger id="ca">
                    <SelectValue placeholder="0-3" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thal" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Activity className="h-3.5 w-3.5 text-primary" /> Thalassemia (thal)
                </Label>
                <Select value={formData.thal} onValueChange={handleSelectChange("thal")}>
                  <SelectTrigger id="thal">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">Normal (3)</SelectItem>
                    <SelectItem value="6">Fixed Defect (6)</SelectItem>
                    <SelectItem value="7">Reversable Defect (7)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button
            onClick={handlePredict}
            disabled={!isFormValid || isLoading}
            className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Analyze Risk
              </span>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Result Section */}
      <ResultCard result={result} isLoading={isLoading} hasAnalyzed={hasAnalyzed} error={error} />
    </div>
  )
}

