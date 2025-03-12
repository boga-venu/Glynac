// src/app/api/dashboard/sentiment-analysis/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Query messages to calculate sentiment percentages
    const messages = await prisma.message.findMany({
      where: {
        sentAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)) // Last 30 days
        }
      }
    })

    const totalMessages = messages.length
    const positiveMessages = messages.filter(msg => msg.isPositive).length
    const negativeMessages = messages.filter(msg => msg.isNegative).length
    const neutralMessages = messages.filter(msg => msg.isNeutral).length

    // Calculate percentages
    const positivePercentage = totalMessages > 0 ? Math.round((positiveMessages / totalMessages) * 100) : 0
    const negativePercentage = totalMessages > 0 ? Math.round((negativeMessages / totalMessages) * 100) : 0
    const neutralPercentage = totalMessages > 0 ? Math.round((neutralMessages / totalMessages) * 100) : 0

    // Get 10 months of sentiment data for the chart
    const today = new Date()
    const months = []
    const data = []

    for (let i = 9; i >= 0; i--) {
      const month = new Date(today)
      month.setMonth(today.getMonth() - i)
      
      // Format month name
      const monthName = month.toLocaleString('default', { month: 'short' })
      months.push(monthName)
      
      // Mock data - replace with actual DB queries in a real app
      data.push({
        month: monthName,
        positive: 65 + Math.floor(Math.random() * 15),
        neutral: 15 + Math.floor(Math.random() * 10),
        negative: 5 + Math.floor(Math.random() * 5)
      })
    }

    return NextResponse.json({
      data,
      positivePercentage,
      neutralPercentage,
      negativePercentage
    })
  } catch (error) {
    console.error('Error fetching sentiment analysis:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sentiment analysis' },
      { status: 500 }
    )
  }
}