import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL ? process.env.N8N_WEBHOOK_URL : 'NOT SET',
  }

  return new NextResponse(`
    <html>
      <body>
        <h1>Environment Variables Debug</h1>
        <pre>${JSON.stringify(envVars, null, 2)}</pre>
      </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  })
}