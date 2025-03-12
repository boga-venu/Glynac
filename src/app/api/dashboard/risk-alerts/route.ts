// src/app/api/dashboard/risk-alerts/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const riskAlerts = await prisma.riskAlert.findMany({
      where: {
        isResolved: false
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 10
    })

    const formattedAlerts = riskAlerts.map(alert => {
      let timeAgo = 'Today'
      const alertDate = new Date(alert.timestamp)
      const today = new Date()
      const diffDays = Math.floor((today.getTime() - alertDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) timeAgo = 'Yesterday'
      else if (diffDays > 1) timeAgo = `${diffDays} days ago`
      
      return {
        id: alert.id,
        title: alert.title,
        description: alert.description,
        type: alert.type,
        severity: alert.severity,
        time: timeAgo,
        employeeId: alert.employee.id,
        employeeName: alert.employee.name
      }
    })

    return NextResponse.json(formattedAlerts)
  } catch (error) {
    console.error('Error fetching risk alerts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch risk alerts' },
      { status: 500 }
    )
  }
}