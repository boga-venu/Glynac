// src/app/api/dashboard/employee-insights/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get users with their retention and performance data
    const users = await prisma.user.findMany({
      where: {
        isAdmin: false // Exclude admin users
      },
      include: {
        retentionData: true,
        performanceData: true,
        sentMessages: {
          orderBy: {
            sentAt: 'desc'
          },
          take: 10
        },
        riskAlerts: {
          where: {
            isResolved: false
          }
        }
      }
    })

    const employees = users.map(user => {
      // Determine status based on retention risk
      let status = 'good'
      if (user.retentionData?.retentionRisk && user.retentionData.retentionRisk > 60) {
        status = 'at_risk'
      } else if (user.retentionData?.retentionRisk && user.retentionData.retentionRisk > 30) {
        status = 'warning'
      }

      // Determine sentiment based on message analysis
      const recentMessages = user.sentMessages || []
      const positiveCount = recentMessages.filter(msg => msg.isPositive).length
      const negativeCount = recentMessages.filter(msg => msg.isNegative).length
      const neutralCount = recentMessages.filter(msg => msg.isNeutral).length
      
      let sentiment = 'neutral'
      if (positiveCount > negativeCount && positiveCount > neutralCount) {
        sentiment = 'positive'
      } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
        sentiment = 'negative'
      }

      // Determine workload based on meeting load
      let workload = 'balanced'
      if (user.retentionData?.meetingLoad && user.retentionData.meetingLoad > 30) {
        workload = 'overloaded'
      } else if (user.retentionData?.meetingLoad && user.retentionData.meetingLoad < 15) {
        workload = 'underloaded'
      }

      // Determine risk level based on active alerts
      let riskLevel = 'low'
      const highRiskAlerts = user.riskAlerts.filter(alert => alert.severity === 'high').length
      const mediumRiskAlerts = user.riskAlerts.filter(alert => alert.severity === 'medium').length
      
      if (highRiskAlerts > 0) {
        riskLevel = 'high'
      } else if (mediumRiskAlerts > 0) {
        riskLevel = 'medium'
      }

      return {
        id: user.id,
        name: user.name,
        status,
        sentiment,
        workload,
        riskLevel
      }
    })

    return NextResponse.json(employees)
  } catch (error) {
    console.error('Error fetching employee insights:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employee insights' },
      { status: 500 }
    )
  }
}
