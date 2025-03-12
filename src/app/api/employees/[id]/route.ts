// src/app/api/employees/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CalendarItem, FileActivity, RiskAlert } from '@prisma/client'

// Define a type for file activity with file relation
type FileActivityWithFile = FileActivity & {
  file: {
    id: string;
    name: string;
    type: string;
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id
   
    // Get user with related data
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        retentionData: true,
        performanceData: true,
        riskAlerts: {
          where: {
            isResolved: false
          },
          orderBy: {
            timestamp: 'desc'
          },
          take: 5
        },
        fileActivities: {
          orderBy: {
            timestamp: 'desc'
          },
          take: 5,
          include: {
            file: true
          }
        },
        scheduleItems: { // Changed from calendarItems to scheduleItems
          where: {
            startTime: {
              gte: new Date(new Date().setDate(new Date().getDate() - 30)) // Last 30 days
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate meeting hours
    const meetingHours = user.scheduleItems.filter((item: CalendarItem) => !item.isFocusTime).length
    
    // Calculate focus blocks
    const focusBlocks = user.scheduleItems.filter((item: CalendarItem) => item.isFocusTime).length
    
    // Format alerts
    const recentAlerts = user.riskAlerts.map((alert: RiskAlert) => ({
      id: alert.id,
      type: alert.type,
      title: alert.title,
      severity: alert.severity
    }))
    
    // Format file activities
    const recentFiles = user.fileActivities.map((activity: FileActivityWithFile) => ({
      id: activity.file.id,
      name: activity.file.name,
      type: activity.file.type,
      action: `${activity.action}ed`,
      date: new Date(activity.timestamp).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }))
    
    // Generate calendar summary
    let calendarSummary = ''
    if (meetingHours > 30) {
      calendarSummary = 'High meeting load this week. Several days with meetings exceeding 8 hours. Limited focus time.'
    } else if (meetingHours < 15) {
      calendarSummary = 'Low meeting load. Significantly underutilized based on company average.'
    } else {
      calendarSummary = 'Balanced workload. Good mix of meetings and focus time.'
    }
    
    // Mock sentiment trend data
    const sentimentTrend = [
      { month: 'Jan', positive: 70, negative: 10 },
      { month: 'Feb', positive: 75, negative: 8 },
      { month: 'Mar', positive: 72, negative: 12 },
      { month: 'Apr', positive: 78, negative: 7 },
      { month: 'May', positive: 80, negative: 5 }
    ]
    
    // Construct and return the employee details
    return NextResponse.json({
      id: user.id,
      name: user.name,
      meetingHours: user.retentionData?.meetingLoad || meetingHours,
      afterHoursPercentage: 5,  // Mock data
      focusBlocks: focusBlocks,
      calendarSummary,
      recentAlerts,
      recentFiles,
      sentimentTrend
    })
  } catch (error) {
    console.error('Error fetching employee details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employee details' },
      { status: 500 }
    )
  }
}