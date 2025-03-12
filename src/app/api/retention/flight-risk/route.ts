// src/app/api/retention/flight-risk/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get users with retention data
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { retentionData: { isNot: null } },
          { retentionData: { retentionRisk: { gt: 40 } } }
        ]
      },
      include: {
        retentionData: true,
        riskAlerts: {
          where: {
            isResolved: false
          }
        }
      }
    })

    const flightRiskEmployees = users.map(user => {
      // Get time in company in years
      const joinDate = user.joinDate
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - joinDate.getTime())
      const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365))
      
      // Determine risk factors
      const factors = []
      
      if (user.retentionData?.calendarOverload) {
        factors.push('Calendar overload')
      }
      
      if (user.retentionData?.meetingLoad && user.retentionData.meetingLoad > 25) {
        factors.push('High meeting load')
      }
      
      if (user.retentionData?.positiveLanguage && user.retentionData.positiveLanguage < 60) {
        factors.push('Low positive language')
      }
      
      if (user.retentionData?.negativeLanguage && user.retentionData.negativeLanguage > 10) {
        factors.push('High negative language')
      }
      
      if (user.retentionData?.complaintCount && user.retentionData.complaintCount > 0) {
        factors.push('Has filed complaints')
      }
      
      if (user.riskAlerts && user.riskAlerts.length > 0) {
        factors.push('Active risk alerts')
      }
      
      return {
        id: user.id,
        name: user.name,
        risk: user.retentionData?.retentionRisk || 0,
        department: user.department,
        tenure: `${diffYears} ${diffYears === 1 ? 'year' : 'years'}`,
        factors
      }
    })

    // Sort by risk level, highest first
    flightRiskEmployees.sort((a, b) => b.risk - a.risk)

    return NextResponse.json(flightRiskEmployees)
  } catch (error) {
    console.error('Error fetching flight risk employees:', error)
    return NextResponse.json(
      { error: 'Failed to fetch flight risk employees' },
      { status: 500 }
    )
  }
}