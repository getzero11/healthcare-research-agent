import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Generate Report API Called ===');
    
    const session = await getServerSession(authOptions)
    console.log('Session retrieved:', JSON.stringify(session, null, 2));
    
    if (!session?.user?.email) {
      console.log('❌ No session or email found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ User authenticated:', session.user.email);

    const { keyword } = await request.json()
    console.log('Keyword received:', keyword);
    
    if (!keyword || typeof keyword !== 'string') {
      console.log('❌ Invalid keyword');
      return NextResponse.json({ error: 'Invalid keyword' }, { status: 400 })
    }

    console.log('Creating report in database...');
    
    // Create report record in database
    const report = await prisma.report.create({
      data: {
        keyword: keyword.trim(),
        status: 'pending',
        userEmail: session.user.email,
      },
    })

    console.log('✅ Report created:', report.id);

    // Trigger n8n workflow via webhook
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    if (!n8nWebhookUrl) {
      throw new Error('N8N webhook URL not configured')
    }

    console.log('Triggering n8n webhook...');

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

      console.log('✅ n8n webhook triggered successfully');

      // Update status to processing
      await prisma.report.update({
        where: { id: report.id },
        data: { status: 'processing' },
      })

      console.log('✅ Report status updated to processing');

    } catch (webhookError) {
      console.error('❌ Failed to trigger n8n webhook:', webhookError)
      
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
    console.error('❌ Error in generate-report:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}