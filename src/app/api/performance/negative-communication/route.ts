// src/app/api/performance/negative-communication/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get users with their performance data
    const users = await prisma.user.findMany({
      where: {
        performanceData: {
          isNot: null
        }
      },
      include: {
        performanceData: true,
        sentMessages: {
          orderBy: {
            sentAt: 'desc'
          },
          take: 100
        }
      }
    })
    
    const negativeCommunicationData = users.map(user => {
      // Get negativity score from performance data
      let negativePercentage = 0
      
      if (user.performanceData?.negativityScore !== undefined) {
        // Convert from 0-1 scale to percentage
        negativePercentage = Math.round(user.performanceData.negativityScore * 100)
      } else if (user.sentMessages.length > 0) {
        // If no performance data, calculate from messages
        const negativeMessages = user.sentMessages.filter(msg => msg.isNegative).length
        negativePercentage = Math.round((negativeMessages / user.sentMessages.length) * 100)
      }
      
      return {
        employee: user.name,
        negativePercentage
      }
    })
    
    // Sort by negativity percentage (descending)
    negativeCommunicationData.sort((a, b) => b.negativePercentage - a.negativePercentage)
    
    // Take top 5 for readability
    return NextResponse.json(negativeCommunicationData.slice(0, 5))
  } catch (error) {
    console.error('Error fetching negative communication data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch negative communication data' },
      { status: 500 }
    )
  }
}