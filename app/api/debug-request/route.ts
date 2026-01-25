import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json()
    
    return new NextResponse(`
      <html>
        <body>
          <h1>Debug Request Data</h1>
          <h2>Request Body:</h2>
          <pre>${JSON.stringify(requestBody, null, 2)}</pre>
          <h2>Headers:</h2>
          <pre>${JSON.stringify(Object.fromEntries(request.headers.entries()), null, 2)}</pre>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    })
  } catch (error: any) {
    return new NextResponse(`
      <html>
        <body>
          <h1>Debug Request Error</h1>
          <p>Error: ${error.message}</p>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
      status: 500
    })
  }
}