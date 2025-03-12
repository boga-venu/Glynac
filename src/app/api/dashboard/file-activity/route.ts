// src/app/api/dashboard/file-activity/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get files with low activity
    const files = await prisma.file.findMany({
      orderBy: {
        lastModified: 'asc' // Oldest modified first
      },
      include: {
        activities: { // Changed from FileActivity to activities
          where: {
            timestamp: {
              gte: new Date(new Date().setDate(new Date().getDate() - 30)) // Last 30 days
            }
          },
          select: {
            action: true,
            timestamp: true,
            user: {
              select: {
                name: true
              }
            }
          }
        }
      },
      take: 10
    })

    const formattedFiles = files.map(file => {
      // Calculate days since last modification
      const today = new Date()
      const lastModified = new Date(file.lastModified)
      const daysSinceModified = Math.floor((today.getTime() - lastModified.getTime()) / (1000 * 60 * 60 * 24))
     
      // Count views in the last 30 days
      const viewsLast30Days = file.activities.filter(activity => // Changed from FileActivity to activities
        activity.action === 'view' || activity.action === 'edit'
      ).length
     
      return {
        id: file.id,
        name: file.name,
        type: file.type,
        creator: file.creatorId, // In a real app, join with user to get the name
        lastModified: `${daysSinceModified} days ago`,
        views: viewsLast30Days
      }
    })

    return NextResponse.json(formattedFiles)
  } catch (error) {
    console.error('Error fetching file activity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch file activity' },
      { status: 500 }
    )
  }
}