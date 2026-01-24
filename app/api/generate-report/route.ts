import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { keyword } = await request.json()
    
    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json({ error: 'Invalid keyword' }, { status: 400 })
    }

    // Create report record in database
    const report = await prisma.report.create({
      data: {
        keyword: keyword.trim(),
        status: 'pending',
        userEmail: session.user.email,
      },
    })

    // Trigger n8n workflow via webhook
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    if (!n8nWebhookUrl) {
      throw new Error('N8N webhook URL not configured')
    }

    try {
      await axios.post(n8nWebhookUrl, {
        keyword: keyword.trim(),
        reportId: report.id,
        userEmail: session.user.email,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout for webhook trigger
      })

      // Update status to processing
      await prisma.report.update({
        where: { id: report.id },
        data: { status: 'processing' },
      })

    } catch (webhookError) {
      console.error('Failed to trigger n8n webhook:', webhookError)
      
      // Update report status to failed
      await prisma.report.update({
        where: { id: report.id },
        data: { 
          status: 'failed',
          error: 'Failed to start report generation'
        },
      })
      
      return NextResponse.json({ 
        error: 'Failed to start report generation' 
      }, { status: 500 })
    }

    return NextResponse.json({
      reportId: report.id,
      status: 'processing',
      message: 'Report generation started'
    })

  } catch (error) {
    console.error('Error in generate-report:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}