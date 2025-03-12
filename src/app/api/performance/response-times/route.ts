// src/app/api/performance/response-times/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get users with their performance data
    const users = await prisma.user.findMany({
      where: {
        performanceData: {
          isNot: null
        }
      },
      include: {
        performanceData: true
      }
    })
    
    // Calculate company-wide benchmark
    let totalResponseTime = 0
    let userCount = 0
    
    users.forEach(user => {
      if (user.performanceData?.respondTime) {
        totalResponseTime += user.performanceData.respondTime
        userCount++
      }
    })
    
    const benchmark = userCount > 0 ? 
      Math.round((totalResponseTime / userCount) * 10) / 10 : 
      2.5 // Default benchmark if no data
    
    // Format response data
    const responseTimeData = users
      .filter(user => user.performanceData?.respondTime !== undefined)
      .map(user => ({
        employee: user.name,
        avgResponse: user.performanceData?.respondTime || 0,
        benchmark
      }))
      // Sort by response time (descending)
      .sort((a, b) => b.avgResponse - a.avgResponse)
      // Take top 5 for readability
      .slice(0, 5)
    
    return NextResponse.json(responseTimeData)
  } catch (error) {
    console.error('Error fetching response times:', error)
    return NextResponse.json(
      { error: 'Failed to fetch response times' },
      { status: 500 }
    )
  }
}