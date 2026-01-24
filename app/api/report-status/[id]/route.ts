import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const reportId = params.id

    const report = await prisma.report.findFirst({
      where: {
        id: reportId,
        userEmail: session.user.email,
      },
    })

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: report.id,
      status: report.status,
      keyword: report.keyword,
      createdAt: report.createdAt.toISOString(),
      pdfUrl: report.pdfUrl,
      driveUrl: report.driveUrl,
      error: report.error,
    })

  } catch (error) {
    console.error('Error fetching report status:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}