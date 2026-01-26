import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Generate Report API Called ===');
    
    const requestBody = await request.json()
    console.log('Full request body:', JSON.stringify(requestBody, null, 2));
    
    const { keyword } = requestBody
    console.log('Keyword received:', keyword);
    
    if (!keyword || typeof keyword !== 'string') {
      console.log('❌ Invalid keyword');
      return NextResponse.json({ error: 'Invalid keyword' }, { status: 400 })
    }

    console.log('✅ Processing request for keyword:', keyword.trim());

    // Trigger n8n workflow via webhook
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL?.trim()
    if (!n8nWebhookUrl) {
      throw new Error('N8N webhook URL not configured')
    }

    console.log('Triggering n8n webhook...');
    console.log('Webhook URL:', n8nWebhookUrl);
    
    const webhookPayload = {
      keyword: keyword.trim()
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

      if (!webhookResponse.ok) {
        throw new Error(`Webhook failed with status: ${webhookResponse.status}`)
      }

      const responseData = await webhookResponse.json()
      console.log('✅ n8n webhook triggered successfully');
      console.log('Webhook response status:', webhookResponse.status);
      console.log('Webhook response data:', responseData);

      return NextResponse.json({
        success: true,
        message: 'Report generation started',
        keyword: keyword.trim(),
        status: 'processing'
      })

    } catch (webhookError: any) {
      console.error('❌ Failed to trigger n8n webhook:', webhookError.message)
      
      return NextResponse.json({ 
        error: 'Failed to start report generation',
        details: webhookError.message
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ Error in generate-report:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}