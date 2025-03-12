// src/app/api/retention/sentiment/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get all messages within the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const messages = await prisma.message.findMany({
      where: {
        sentAt: {
          gte: thirtyDaysAgo
        }
      }
    })
    
    // Count messages by sentiment type
    const positiveMessages = messages.filter(msg => msg.isPositive).length
    const negativeMessages = messages.filter(msg => msg.isNegative).length
    const neutralMessages = messages.filter(msg => msg.isNeutral).length
    
    const totalMessages = messages.length
    
    // Calculate percentages
    const positivePercentage = totalMessages > 0 ? Math.round((positiveMessages / totalMessages) * 100) : 0
    const negativePercentage = totalMessages > 0 ? Math.round((negativeMessages / totalMessages) * 100) : 0
    const neutralPercentage = totalMessages > 0 ? Math.round((neutralMessages / totalMessages) * 100) : 0
    
    // For historical distribution, we need to group by month
    // Get messages from the last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    const historicalMessages = await prisma.message.findMany({
      where: {
        sentAt: {
          gte: sixMonthsAgo
        }
      },
      orderBy: {
        sentAt: 'asc'
      }
    })
    
    // Group by month
    const sentimentByMonth: Record<string, { positive: number, neutral: number, negative: number, total: number }> = {}
    
    historicalMessages.forEach(message => {
      const date = new Date(message.sentAt)
      const monthKey = date.toLocaleString('default', { month: 'short' })
      
      if (!sentimentByMonth[monthKey]) {
        sentimentByMonth[monthKey] = {
          positive: 0,
          neutral: 0,
          negative: 0,
          total: 0
        }
      }
      
      if (message.isPositive) sentimentByMonth[monthKey].positive++
      if (message.isNeutral) sentimentByMonth[monthKey].neutral++
      if (message.isNegative) sentimentByMonth[monthKey].negative++
      sentimentByMonth[monthKey].total++
    })
    
    // Convert to array and calculate percentages
    const distribution = Object.entries(sentimentByMonth).map(([month, counts]) => {
      const { positive, neutral, negative, total } = counts
      
      return {
        month,
        positive: total > 0 ? Math.round((positive / total) * 100) : 0,
        neutral: total > 0 ? Math.round((neutral / total) * 100) : 0,
        negative: total > 0 ? Math.round((negative / total) * 100) : 0
      }
    })
    
    // Check if we have enough data to calculate a trend
    let trend = 0
    if (distribution.length >= 2) {
      const latestMonth = distribution[distribution.length - 1]
      const previousMonth = distribution[distribution.length - 2]
      
      trend = latestMonth.positive - previousMonth.positive
    }
    
    return NextResponse.json({
      distribution: [
        { name: 'Positive', value: positivePercentage },
        { name: 'Neutral', value: neutralPercentage },
        { name: 'Negative', value: negativePercentage },
      ],
      historicalData: distribution,
      trend
    })
  } catch (error) {
    console.error('Error analyzing sentiment:', error)
    return NextResponse.json(
      { error: 'Failed to analyze sentiment' },
      { status: 500 }
    )
  }
}