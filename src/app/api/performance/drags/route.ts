// src/app/api/performance/drags/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get users with performance data
    const users = await prisma.user.findMany({
      where: {
        performanceData: {
          isNot: null
        }
      },
      include: {
        performanceData: true,
        sentMessages: {
          orderBy: {
            sentAt: 'desc'
          },
          take: 100
        }
      }
    })

    const performanceDrags = users.map(user => {
      // Get response time from performance data
      const responseTime = user.performanceData?.respondTime || 0
      
      // Get negativity score from performance data
      const negativity = user.performanceData?.negativityScore || 0
      
      // Convert negativity to percentage (assuming it's stored as 0-1)
      const negativityPercentage = Math.round(negativity * 100)
      
      return {
        employee: user.name,
        negativity: negativityPercentage,
        responseTime: responseTime,
        size: 100  // Size for scatter plot visualization
      }
    })

    // Filter out users with low values in both metrics (not considered drags)
    const significantDrags = performanceDrags.filter(
      user => user.negativity > 15 || user.responseTime > 2
    )

    return NextResponse.json(significantDrags)
  } catch (error) {
    console.error('Error fetching performance drags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch performance drags' },
      { status: 500 }
    )
  }
}