import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
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
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
        status: 500
      })
    }

    console.log('Testing webhook connection...');

    try {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: "Test Connection"
        })
      })

      console.log('Webhook response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const responseData = await response.json()
      console.log('✅ Webhook test successful:', responseData);

      return new NextResponse(`
        <html>
          <body>
            <h1>✅ Webhook Test Successful</h1>
            <p><strong>Webhook URL:</strong> ${n8nWebhookUrl}</p>
            <p><strong>Status:</strong> ${response.status}</p>
            <p><strong>Response:</strong> ${JSON.stringify(responseData, null, 2)}</p>
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

export async function POST(request: NextRequest) {
  try {
    console.log('=== Test Webhook POST ===');
    
    const requestBody = await request.json()
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const { keyword } = requestBody
    
    // Test n8n webhook connection
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL?.trim()
    console.log('N8N_WEBHOOK_URL from env:', n8nWebhookUrl);
    
    if (!n8nWebhookUrl) {
      return NextResponse.json({ 
        error: 'N8N webhook URL not configured'
      }, { status: 500 })
    }

    const webhookPayload = {
      keyword: keyword || 'Test Keyword'
    }
    console.log('Webhook payload:', JSON.stringify(webhookPayload, null, 2));

    try {
      const webhookResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      })

      console.log('Webhook response status:', webhookResponse.status);

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text()
        console.log('Webhook error response:', errorText);
        return NextResponse.json({ 
          error: 'Webhook failed',
          status: webhookResponse.status,
          response: errorText
        }, { status: 500 })
      }

      const responseData = await webhookResponse.json()
      console.log('✅ n8n webhook response:', responseData);

      return NextResponse.json({
        success: true,
        message: 'Test webhook successful',
        n8nResponse: responseData,
        webhookUrl: n8nWebhookUrl,
        payload: webhookPayload
      })

    } catch (webhookError: any) {
      console.error('❌ Webhook error:', webhookError);
      
      return NextResponse.json({ 
        error: 'Webhook connection failed',
        details: webhookError.message
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('❌ Test webhook error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message
    }, { status: 500 })
  }
}