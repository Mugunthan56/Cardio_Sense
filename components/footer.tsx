import { ShieldCheck } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 py-6 text-center">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>For educational purposes only. Not a medical diagnosis tool.</span>
        </div>
        <p className="text-xs text-muted-foreground/60">
          {"© 2026 HeartGuard. All rights reserved."}
        </p>
      </div>
    </footer>
  )
}

import { ShieldCheck } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 py-6 text-center">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>For educational purposes only. Not a medical diagnosis tool.</span>
        </div>
        <p className="text-xs text-muted-foreground/60">
          {"© 2026 CARDIO SENSE. All rights reserved."}
        </p>
      </div>
    </footer>
  )
}
