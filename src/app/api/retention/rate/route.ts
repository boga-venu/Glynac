// src/app/api/retention/rate/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get total count of users
    const totalUsers = await prisma.user.count({
      where: {
        isAdmin: false // Exclude admin users
      }
    })
    
    // Get count of at-risk users
    const atRiskUsers = await prisma.user.count({
      where: {
        retentionData: {
          retentionRisk: {
            gt: 60 // Users with high risk (>60%)
          }
        }
      }
    })
    
    // Calculate retention rate (percentage of users not at high risk)
    const retentionRate = Math.round(((totalUsers - atRiskUsers) / totalUsers) * 100)
    
    // Calculate industry average (for demo purposes, would normally come from external data)
    const industryAverage = 82
    
    // Mock trend data (in a real app, would compare to historical data)
    const trend = retentionRate - industryAverage
    
    return NextResponse.json({
      rate: retentionRate,
      industryAverage,
      trend
    })
  } catch (error) {
    console.error('Error calculating retention rate:', error)
    return NextResponse.json(
      { error: 'Failed to calculate retention rate' },
      { status: 500 }
    )
  }
}