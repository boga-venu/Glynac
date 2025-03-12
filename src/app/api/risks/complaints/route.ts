// src/app/api/risks/complaints/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get risk alerts of type 'complaint'
    const complaints = await prisma.riskAlert.findMany({
      where: {
        type: 'complaint'
      },
      orderBy: {
        timestamp: 'asc'
      }
    })

    // Group complaints by week
    const complaintsByWeek = complaints.reduce((acc, complaint) => {
      // Convert timestamp to week number (approximate)
      const timestamp = new Date(complaint.timestamp)
      const startDate = new Date(timestamp.getFullYear(), 0, 1)
      const days = Math.floor((timestamp.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))
      const weekNumber = Math.ceil(days / 7)
      
      const weekLabel = `Week ${weekNumber}`
      
      // Add to accumulator
      if (!acc[weekLabel]) {
        acc[weekLabel] = 0
      }
      acc[weekLabel]++
      
      return acc
    }, {} as Record<string, number>)
    
    // Convert to array for chart consumption
    const complaintTrends = Object.entries(complaintsByWeek).map(([period, count]) => ({
      period,
      count
    }))

    // Sort by week number
    complaintTrends.sort((a, b) => {
      const aWeek = parseInt(a.period.split(' ')[1])
      const bWeek = parseInt(b.period.split(' ')[1])
      return aWeek - bWeek
    })

    return NextResponse.json(complaintTrends)
  } catch (error) {
    console.error('Error fetching complaint trends:', error)
    return NextResponse.json(
      { error: 'Failed to fetch complaint trends' },
      { status: 500 }
    )
  }
}