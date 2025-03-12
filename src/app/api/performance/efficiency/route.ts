// src/app/api/performance/efficiency/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Calculate average task completion rate
    const performanceData = await prisma.performanceData.findMany()
    
    // Skip calculation if no data
    if (performanceData.length === 0) {
      return NextResponse.json({
        taskCompletionRate: 75, // Default values if no data
        avgResponseTime: 4,
        meetingOverload: 5
      })
    }
    
    // Calculate average task completion rate
    const totalTaskRate = performanceData.reduce((sum, data) => sum + data.taskCompletionRate, 0)
    const avgTaskRate = Math.round(totalTaskRate / performanceData.length)
    
    // Calculate average response time
    const totalResponseTime = performanceData.reduce((sum, data) => sum + data.respondTime, 0)
    const avgResponseTime = Math.round((totalResponseTime / performanceData.length) * 10) / 10 // Round to 1 decimal place
    
    // Calculate average meeting overload
    // For this metric, we'll check calendar data to see how many users have excessive meetings
    const users = await prisma.user.findMany({
      include: {
        scheduleItems: true
      }
    })
    
    // Define "overload" as having more than 25 meetings per week
    const meetingThreshold = 25
    
    // Count users with meeting overload
    let usersWithOverload = 0
    users.forEach(user => {
      const meetingCount = user.scheduleItems.filter(item => !item.isFocusTime).length
      if (meetingCount > meetingThreshold) {
        usersWithOverload++
      }
    })
    
    // Calculate average meeting overload (meetings above threshold)
    const meetingOverload = Math.round(usersWithOverload / users.length * 10) // Scale to a 0-10 range
    
    return NextResponse.json({
      taskCompletionRate: avgTaskRate,
      avgResponseTime,
      meetingOverload
    })
  } catch (error) {
    console.error('Error calculating efficiency scores:', error)
    return NextResponse.json(
      { error: 'Failed to calculate efficiency scores' },
      { status: 500 }
    )
  }
}