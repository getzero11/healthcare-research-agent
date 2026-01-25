import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
  try {
    console.log('=== Testing n8n Webhook Connection ===');
    
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    console.log('N8N_WEBHOOK_URL:', n8nWebhookUrl);
    
    if (!n8nWebhookUrl) {
      return NextResponse.json({ 
        error: 'N8N_WEBHOOK_URL not configured',
        env: process.env 
      }, { status: 500 })
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

      return NextResponse.json({
        success: true,
        webhookUrl: n8nWebhookUrl,
        response: {
          status: response.status,
          statusText: response.statusText,
          data: response.data
        }
      })

    } catch (webhookError: any) {
      console.error('❌ Webhook test failed:', webhookError.message);
      
      return NextResponse.json({ 
        error: 'Webhook connection failed',
        webhookUrl: n8nWebhookUrl,
        details: {
          message: webhookError.message,
          code: webhookError.code,
          status: webhookError.response?.status,
          statusText: webhookError.response?.statusText
        }
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('❌ Test error:', error);
    return NextResponse.json({ 
      error: 'Test failed',
      message: error.message
    }, { status: 500 })
  }
}