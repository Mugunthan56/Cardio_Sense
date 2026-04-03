import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'

import './globals.css'

const _inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const _spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
<<<<<<< HEAD
  title: 'HeartGuard: AI Heart Disease Predictor',
=======
  title: 'CARDIO SENSE: DATA DRIVEN CARDIAC DISEASE RISK',
>>>>>>> a3421f2 (Initial project upload - full stack AI project)
  description:
    'AI-powered heart disease risk prediction dashboard for educational purposes.',
}

export const viewport: Viewport = {
  themeColor: '#0d9488',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${_inter.variable} ${_spaceGrotesk.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
