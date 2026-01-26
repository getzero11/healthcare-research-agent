import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory storage for demo (in production, use a database)
const reportStatus = new Map<string, any>()

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
    
    // Store the report status (use keyword as key for simplicity)
    if (keyword) {
      reportStatus.set(keyword, {
        status,
        keyword,
        pdfUrl,
        driveUrl,
        error,
        completedAt: new Date().toISOString()
      })
      console.log(`✅ Stored report status for: ${keyword}`);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Callback received successfully',
      receivedAt: new Date().toISOString(),
      storedKeyword: keyword
    })

  } catch (error) {
    console.error('❌ Error in n8n callback:', error)
    return NextResponse.json({ 
      error: 'Failed to process callback' 
    }, { status: 500 })
  }
}

// GET endpoint to check report status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const keyword = searchParams.get('keyword')
    
    if (!keyword) {
      return NextResponse.json({ error: 'Keyword parameter required' }, { status: 400 })
    }
    
    const status = reportStatus.get(keyword)
    
    if (!status) {
      return NextResponse.json({ 
        status: 'processing',
        message: 'Report still processing or not found'
      })
    }
    
    return NextResponse.json(status)
    
  } catch (error) {
    console.error('❌ Error checking report status:', error)
    return NextResponse.json({ 
      error: 'Failed to check status' 
    }, { status: 500 })
  }
}