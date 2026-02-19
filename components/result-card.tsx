"use client"

import { ShieldCheck, ShieldAlert, HeartPulse, Activity, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import type { PredictionResult } from "@/components/prediction-form"

interface ResultCardProps {
  result: PredictionResult | null
  isLoading: boolean
  hasAnalyzed: boolean
  error: string | null
}

export function ResultCard({ result, isLoading, hasAnalyzed, error }: ResultCardProps) {
  // Error state
  if (error && hasAnalyzed) {
    return (
      <Card className="flex flex-col items-center justify-center border-destructive/30 bg-destructive/5 shadow-md">
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-destructive">
              Analysis Error
            </p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              {error}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Placeholder state
  if (!hasAnalyzed && !isLoading) {
    return (
      <Card className="flex flex-col items-center justify-center border-dashed border-border/60 bg-muted/30 shadow-md">
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="rounded-full bg-muted p-4">
            <HeartPulse className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-foreground/60">
              Awaiting Analysis
            </p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Fill in patient vitals and click &ldquo;Analyze Risk&rdquo; to
              generate a heart disease risk prediction.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <Card className="flex flex-col items-center justify-center border-border/60 shadow-md">
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="relative">
            <div className="rounded-full bg-primary/10 p-4">
              <Activity className="h-10 w-10 text-primary" />
            </div>
            <Spinner className="absolute -bottom-1 -right-1 h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-foreground">
              Running Analysis
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Processing patient data through the model...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Result state
  if (!result) return null

  const isHighRisk = result.risk === "high"
  const probabilityPercent = result.probability
  const meterWidth = Math.max(5, Math.min(95, probabilityPercent))

  return (
    <Card className="flex flex-col items-center justify-center border-border/60 shadow-md">
      <CardContent className="flex flex-col items-center gap-5 py-12 text-center">
        {/* Risk icon */}
        <div
          className={`rounded-full p-5 ${isHighRisk
            ? "bg-destructive/10"
            : "bg-emerald-50"
            }`}
        >
          {isHighRisk ? (
            <ShieldAlert className="h-12 w-12 text-destructive" />
          ) : (
            <ShieldCheck className="h-12 w-12 text-emerald-600" />
          )}
        </div>

        {/* Risk label */}
        <div>
          <p
            className={`font-display text-3xl font-bold ${isHighRisk ? "text-destructive" : "text-emerald-600"
              }`}
          >
            {isHighRisk ? "High Risk" : "Low Risk"}
          </p>
          <p className="mt-1 font-display text-lg text-foreground/70">
            {probabilityPercent}% disease probability
          </p>
          <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
            {isHighRisk
              ? "Elevated indicators detected. Please consult a healthcare professional for further evaluation."
              : "Current vitals suggest a lower probability of heart disease. Maintain a healthy lifestyle."}
          </p>
        </div>

        {/* Risk meter bar */}
        <div className="w-full max-w-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>High</span>
          </div>
          <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${probabilityPercent < 40
                ? "bg-emerald-500"
                : probabilityPercent < 60
                  ? "bg-amber-500"
                  : "bg-destructive"
                }`}
              style={{ width: `${meterWidth}%` }}
              role="progressbar"
              aria-valuenow={probabilityPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Heart disease risk: ${probabilityPercent}%`}
            />
          </div>
          <p className="mt-1.5 text-center text-xs text-muted-foreground">
            Confidence: {result.confidence}%
          </p>
        </div>

        {/* Model info badges */}
        <div className="flex flex-col items-center gap-2">
          <Badge
            variant="secondary"
            className="border border-border bg-muted text-muted-foreground"
          >
            Prediction based on {result.model_info.algorithm} Model
          </Badge>
          <p className="text-xs text-muted-foreground">
            Trained on {result.model_info.training_samples || 303} samples | Model accuracy: <span className="font-bold text-emerald-600">{result.model_info.accuracy || 87}%</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
