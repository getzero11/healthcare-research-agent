import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
  try {
    console.log('=== Testing n8n Webhook Connection ===');
    
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL?.trim()
    console.log('N8N_WEBHOOK_URL:', n8nWebhookUrl);
    
    if (!n8nWebhookUrl) {
      return new NextResponse(`
        <html>
          <body>
            <h1>❌ Configuration Error</h1>
            <p><strong>Error:</strong> N8N_WEBHOOK_URL not configured</p>
            <p><strong>Environment Variables:</strong></p>
            <pre>${JSON.stringify(process.env, null, 2)}</pre>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
        status: 500
      })
    }

    console.log('Testing webhook connection...');

    try {
      const response = await axios.post(n8nWebhookUrl, {
        keyword: "Test Connection",
        reportId: "test-connection-123",
        userEmail: "test@example.com"
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      })

      console.log('✅ Webhook test successful:', response.status);

      return new NextResponse(`
        <html>
          <body>
            <h1>✅ Webhook Test Successful</h1>
            <p><strong>Webhook URL:</strong> ${n8nWebhookUrl}</p>
            <p><strong>Status:</strong> ${response.status} ${response.statusText}</p>
            <p><strong>Response:</strong> ${JSON.stringify(response.data)}</p>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      })

    } catch (webhookError: any) {
      console.error('❌ Webhook test failed:', webhookError.message);
      
      return new NextResponse(`
        <html>
          <body>
            <h1>❌ Webhook Test Failed</h1>
            <p><strong>Webhook URL:</strong> ${n8nWebhookUrl}</p>
            <p><strong>Error:</strong> ${webhookError.message}</p>
            <p><strong>Code:</strong> ${webhookError.code}</p>
            <p><strong>Status:</strong> ${webhookError.response?.status}</p>
            <p><strong>Status Text:</strong> ${webhookError.response?.statusText}</p>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
        status: 500
      })
    }

  } catch (error: any) {
    console.error('❌ Test error:', error);
    return new NextResponse(`
      <html>
        <body>
          <h1>❌ Test Failed</h1>
          <p><strong>Error:</strong> ${error.message}</p>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
      status: 500
    })
  }
}