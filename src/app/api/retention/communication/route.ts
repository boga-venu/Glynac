// src/app/api/retention/communication/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get all messages
    const messages = await prisma.message.findMany({
      orderBy: {
        sentAt: 'asc'
      }
    })
    
    // Group messages by month for trend analysis
    const messagesByMonth: Record<string, number> = {}
    
    messages.forEach(message => {
      const date = new Date(message.sentAt)
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
      
      if (!messagesByMonth[monthKey]) {
        messagesByMonth[monthKey] = 0
      }
      
      messagesByMonth[monthKey]++
    })
    
    // Convert to array for recharts
    const volumeByMonth = Object.entries(messagesByMonth).map(([monthKey, count]) => {
      const [year, month] = monthKey.split('-')
      const date = new Date(parseInt(year), parseInt(month) - 1, 1)
      
      // Get month name
      const monthName = date.toLocaleString('default', { month: 'short' })
      
      return {
        month: monthName,
        volume: count
      }
    })
    
    // Calculate overall engagement rate based on average messages per user
    const totalUsers = await prisma.user.count({
      where: {
        isAdmin: false // Exclude admin users
      }
    })
    
    const totalMessages = messages.length
    const messagesPerUser = totalMessages / (totalUsers || 1)
    
    // Calculate engagement rate (simplified formula)
    const engagementRate = Math.min(Math.round((messagesPerUser / 10) * 100), 100) // Cap at 100%
    
    // Calculate trend by comparing last two months
    const sortedMonths = Object.keys(messagesByMonth).sort()
    const latestMonth = sortedMonths[sortedMonths.length - 1]
    const previousMonth = sortedMonths[sortedMonths.length - 2]
    
    let trend = 0
    if (latestMonth && previousMonth) {
      const latestCount = messagesByMonth[latestMonth]
      const previousCount = messagesByMonth[previousMonth]
      
      if (previousCount > 0) {
        trend = Math.round(((latestCount - previousCount) / previousCount) * 100)
      }
    }
    
    return NextResponse.json({
      total: totalMessages,
      engagementRate,
      trend,
      volumeByMonth
    })
  } catch (error) {
    console.error('Error analyzing communication volume:', error)
    return NextResponse.json(
      { error: 'Failed to analyze communication volume' },
      { status: 500 }
    )
  }
}