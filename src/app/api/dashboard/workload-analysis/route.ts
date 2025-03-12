import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get department data
    const departments = await prisma.department.findMany({
      select: {
        name: true
      }
    })

    // Calculate workload metrics
    // In a real app, we would use actual calendar data
    const departmentData = departments.map(dept => {
      // Simplified mock data based on department
      // In a real app, calculate this from calendar and retention data
      const meetingHours = 
        dept.name === 'Marketing' ? 28 :
        dept.name === 'Engineering' ? 22 :
        dept.name === 'Product' ? 26 :
        dept.name === 'Finance' ? 24 :
        dept.name === 'HR' ? 20 : 26
        
      const afterHours = 
        dept.name === 'Marketing' ? 5 :
        dept.name === 'Engineering' ? 12 :
        dept.name === 'Product' ? 8 :
        dept.name === 'Finance' ? 3 :
        dept.name === 'HR' ? 2 : 6
        
      return {
        department: dept.name,
        meetingHours,
        afterHours
      }
    })

    // Calculate overall metrics
    const totalUsers = await prisma.user.count()
    let totalMeetingHours = 0
    let totalFocusBlocks = 0
    let afterHoursCount = 0

    const calendarData = await prisma.calendarItem.findMany({
      where: {
        startTime: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)) // Last 30 days
        }
      }
    })
    
    // Calculate metrics (mocked for simplicity)
    totalMeetingHours = 24.3 // Average per user
    totalFocusBlocks = 9 // Average per user
    afterHoursCount = 12 // Percentage

    return NextResponse.json({
      data: departmentData,
      avgMeetingHours: totalMeetingHours,
      afterHoursPercentage: afterHoursCount,
      avgFocusBlocks: totalFocusBlocks
    })
  } catch (error) {
    console.error('Error fetching workload analysis:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workload analysis' },
      { status: 500 }
    )
  }
}