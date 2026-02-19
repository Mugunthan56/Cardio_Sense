import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PredictionForm } from "@/components/prediction-form"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-10">
          {/* Hero section */}
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              DATA DRIVEN CARDIAC DISEASE RISK
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground text-pretty">
              Enter patient health indicators below. Our AI model analyzes key
              vitals to provide an instant risk assessment for heart disease.
            </p>
          </div>

          {/* Form + Results */}
          <PredictionForm />
        </div>
      </main>

      <Footer />
    </div>
  )
}
