// src/app/api/performance/overdue-tasks/route.ts
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
    
    const overdueTasksData = users
      .filter(user => user.performanceData?.overdueTasks !== undefined)
      .map(user => ({
        employee: user.name,
        count: user.performanceData?.overdueTasks || 0
      }))
      // Sort by count (descending)
      .sort((a, b) => b.count - a.count)
      // Take top 5 for readability
      .slice(0, 5)
    
    return NextResponse.json(overdueTasksData)
  } catch (error) {
    console.error('Error fetching overdue tasks data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch overdue tasks data' },
      { status: 500 }
    )
  }
}