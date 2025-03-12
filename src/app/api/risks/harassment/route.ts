// src/app/api/risks/harassment/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Find messages with negative sentiment and potential harassment indicators
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { isNegative: true },
          { sentimentScore: { lt: -0.5 } } // Very negative sentiment
        ]
      },
      include: {
        sender: true
      },
      orderBy: {
        sentAt: 'desc'
      },
      take: 10
    })

    const harassmentMessages = messages.map(message => {
      // Calculate severity based on sentiment score
      let severity = 'low'
      if (message.sentimentScore < -0.7) {
        severity = 'high'
      } else if (message.sentimentScore < -0.5) {
        severity = 'medium'
      }

      return {
        id: message.id,
        sender: message.sender.name,
        content: message.content,
        timestamp: message.sentAt.toISOString(),
        severity
      }
    })

    return NextResponse.json(harassmentMessages)
  } catch (error) {
    console.error('Error fetching harassment messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch harassment messages' },
      { status: 500 }
    )
  }
}