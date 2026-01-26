import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('=== n8n Callback Received ===');
    
    const requestBody = await request.json()
    console.log('Callback data:', JSON.stringify(requestBody, null, 2));
    
    const { status, keyword, pdfUrl, driveUrl, error } = requestBody
    
    // Log the completion
    console.log(`Report ${status} for keyword: ${keyword}`);
    if (pdfUrl) console.log('PDF URL:', pdfUrl);
    if (driveUrl) console.log('Drive URL:', driveUrl);
    if (error) console.log('Error:', error);
    
    // In a real implementation, you might:
    // 1. Store this in a database
    // 2. Send notifications to users
    // 3. Update frontend via WebSocket/SSE
    // 4. Send emails
    
    // For now, just acknowledge receipt
    return NextResponse.json({
      success: true,
      message: 'Callback received successfully',
      receivedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error in n8n callback:', error)
    return NextResponse.json({ 
      error: 'Failed to process callback' 
    }, { status: 500 })
  }
}