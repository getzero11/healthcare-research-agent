import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory storage for demo (in production, use a database)
const reportStatus = new Map<string, any>()

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json()
    const { status, keyword, pdfUrl, driveUrl, error } = requestBody
    
    // Store the report status
    if (keyword) {
      reportStatus.set(keyword, {
        status,
        keyword,
        pdfUrl,
        driveUrl,
        error,
        completedAt: new Date().toISOString()
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Callback received successfully',
      receivedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in n8n callback:', error)
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
    console.error('Error checking report status:', error)
    return NextResponse.json({ 
      error: 'Failed to check status' 
    }, { status: 500 })
  }
}