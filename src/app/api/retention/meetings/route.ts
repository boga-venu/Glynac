// src/app/api/retention/meetings/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get users with their calendar items (meetings and focus time)
    const users = await prisma.user.findMany({
      where: {
        isAdmin: false // Exclude admin users
      },
      include: {
        scheduleItems: true
      }
    })
    
    // Calculate meeting load and focus time for each user
    const employeeData = users.map(user => {
      // Count meetings and focus blocks
      const meetings = user.scheduleItems.filter(item => !item.isFocusTime).length
      const focusTime = user.scheduleItems.filter(item => item.isFocusTime).length
      
      return {
        employee: user.name,
        meetings,
        focusTime
      }
    })
    
    // Calculate averages across all users
    const totalUsers = users.length
    let totalMeetings = 0
    let totalFocusTime = 0
    
    employeeData.forEach(employee => {
      totalMeetings += employee.meetings
      totalFocusTime += employee.focusTime
    })
    
    const averageMeetings = Math.round(totalMeetings / totalUsers)
    const averageFocusTime = Math.round(totalFocusTime / totalUsers)
    
    // Calculate optimal balance (users with good meeting-to-focus time ratio)
    // A good ratio might be considered 2:1 (meetings:focus)
    const usersWithGoodBalance = employeeData.filter(employee => {
      // Check if employee has a reasonable ratio
      const ratio = employee.meetings / (employee.focusTime || 1)
      return ratio <= 2 && ratio >= 0.5
    }).length
    
    const optimalBalance = Math.round((usersWithGoodBalance / totalUsers) * 100)
    
    return NextResponse.json({
      averageMeetings,
      averageFocusTime,
      optimalBalance,
      employeeData
    })
  } catch (error) {
    console.error('Error analyzing meeting load:', error)
    return NextResponse.json(
      { error: 'Failed to analyze meeting load' },
      { status: 500 }
    )
  }
}