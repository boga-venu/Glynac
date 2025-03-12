// src/app/api/risks/security/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get users with risk alerts related to security
    const users = await prisma.user.findMany({
      where: {
        riskAlerts: {
          some: {
            type: 'security',
            isResolved: false
          }
        }
      },
      include: {
        riskAlerts: {
          where: {
            type: 'security',
            isResolved: false
          }
        },
        fileActivities: {
          take: 5,
          orderBy: {
            timestamp: 'desc'
          },
          include: {
            file: true
          }
        }
      }
    })

    const securityRisks = users.map(user => {
      // Find the highest severity alert for this user
      const highestSeverityAlert = user.riskAlerts.reduce((highest, current) => {
        const severityMap = { high: 3, medium: 2, low: 1 }
        const currentSeverity = severityMap[current.severity as 'high' | 'medium' | 'low'] || 0
        const highestSeverity = severityMap[highest?.severity as 'high' | 'medium' | 'low'] || 0
        
        return currentSeverity > highestSeverity ? current : highest
      }, user.riskAlerts[0])
      
      // Calculate a risk score based on alert severity and recent file activities
      let riskScore = 0
      if (highestSeverityAlert) {
        riskScore = highestSeverityAlert.severity === 'high' ? 75 : 
                   highestSeverityAlert.severity === 'medium' ? 50 : 25
      }
      
      // Additional risk score from file activities
      if (user.fileActivities.length > 3) {
        riskScore += 10; // Increase risk score for high file activity
      }
      
      return {
        id: user.id,
        employeeId: user.id,
        employeeName: user.name,
        riskLevel: highestSeverityAlert?.severity || 'low',
        riskScore,
        activityDescription: highestSeverityAlert?.description || 'No specific activity detected',
        timestamp: highestSeverityAlert?.timestamp.toISOString() || new Date().toISOString()
      }
    })

    return NextResponse.json(securityRisks)
  } catch (error) {
    console.error('Error fetching security risks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch security risks' },
      { status: 500 }
    )
  }
}