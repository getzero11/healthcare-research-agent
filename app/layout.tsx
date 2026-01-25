import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Healthcare Market Research Agent | iHealthcareAnalyst',
  description: 'Generate comprehensive healthcare market research reports with AI-powered analysis, market sizing, competitive landscape, and forecasts.',
  keywords: 'healthcare market research, medical device market, pharmaceutical market analysis, healthcare AI, market reports',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}