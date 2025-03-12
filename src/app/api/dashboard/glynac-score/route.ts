// src/app/api/dashboard/glynac-score/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get latest Glynac score
    const latestScore = await prisma.glynacScore.findFirst({
      orderBy: {
        date: 'desc'
      }
    })

    // Get previous month's score for trend calculation
    const previousScore = await prisma.glynacScore.findFirst({
      orderBy: {
        date: 'desc'
      },
      skip: 1
    })

    if (!latestScore) {
      return NextResponse.json(
        { 
          error: 'No Glynac score data available' 
        }, 
        { status: 404 }
      )
    }

    const trend = previousScore 
      ? latestScore.overallScore - previousScore.overallScore
      : 0

    return NextResponse.json({
      overallScore: latestScore.overallScore,
      communicationScore: latestScore.communicationScore,
      workloadScore: latestScore.workloadScore,
      wellbeingScore: latestScore.wellbeingScore,
      trend
    })
  } catch (error) {
    console.error('Error fetching Glynac score:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Glynac score' },
      { status: 500 }
    )
  }
}