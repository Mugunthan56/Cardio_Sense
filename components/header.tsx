import { HeartPulse } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-4">
        <div className="flex items-center justify-center rounded-lg bg-primary p-2">
          <HeartPulse className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
            CARDIO SENSE
          </h1>
          <p className="text-xs text-muted-foreground">
            AI Heart Disease Predictor
          </p>
        </div>
      </div>
    </header>
  )
}
