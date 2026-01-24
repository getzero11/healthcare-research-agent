import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { 
      reportId, 
      status, 
      pdfUrl, 
      driveUrl, 
      error,
      keyword 
    } = body

    if (!reportId) {
      return NextResponse.json({ error: 'Missing reportId' }, { status: 400 })
    }

    // Update report in database
    const updateData: any = {
      status: status || 'completed',
    }

    if (pdfUrl) updateData.pdfUrl = pdfUrl
    if (driveUrl) updateData.driveUrl = driveUrl
    if (error) updateData.error = error
    if (status === 'completed') updateData.completedAt = new Date()

    const report = await prisma.report.update({
      where: { id: reportId },
      data: updateData,
    })

    console.log(`Report ${reportId} updated:`, {
      status: report.status,
      keyword: report.keyword,
      pdfUrl: report.pdfUrl ? 'Present' : 'Missing',
      driveUrl: report.driveUrl ? 'Present' : 'Missing',
    })

    return NextResponse.json({ 
      success: true,
      message: 'Report status updated'
    })

  } catch (error) {
    console.error('Error in n8n callback webhook:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}