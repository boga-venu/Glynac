// src/app/api/alerts/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const alertId = params.id;

    // Fetch the alert with related data
    const alert = await prisma.riskAlert.findUnique({
      where: { id: alertId },
      include: {
        employee: true,
        flaggedMessages: {
          include: {
            sender: true,
            receiver: true,
          },
        },
      },
    });

    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    // Extract unique employee IDs
    const uniqueEmployeeIds = new Set<string>();
    alert.flaggedMessages.forEach((msg) => {
      if (msg.sender?.id) uniqueEmployeeIds.add(msg.sender.id);
      if (msg.receiver?.id) uniqueEmployeeIds.add(msg.receiver.id);
    });

    // Map unique employee IDs to friendly numbers (1024, 1036, etc.)
    const idMapping = new Map<string, number>();
    let counter = 1024;

    uniqueEmployeeIds.forEach((id) => {
      idMapping.set(id, counter);
      counter += 12; // Increment for uniqueness
    });

    // Convert participants using the mapping
    const participantsArray = Array.from(uniqueEmployeeIds).map(
      (id) => `Employee ${idMapping.get(id)}`
    );

    // Process messages and correctly assign mapped sender IDs
    const messages = alert.flaggedMessages.map((msg) => ({
      id: msg.id,
      sender: msg.sender?.id ? `Employee ${idMapping.get(msg.sender.id)}` : 'Unknown',
      content: msg.content,
      timestamp: msg.sentAt.toISOString(),
      isFlagged: msg.sentimentScore < -0.5,
    }));

    // Calculate timestamp display
    const today = new Date();
    const alertDate = new Date(alert.timestamp);
    const diffDays = Math.floor((today.getTime() - alertDate.getTime()) / (1000 * 60 * 60 * 24));

    let timeAgo = 'Today';
    if (diffDays === 1) timeAgo = 'Yesterday';
    else if (diffDays > 1) timeAgo = `${diffDays} days ago`;

    // Return response
    return NextResponse.json({
      id: alert.id,
      participants: participantsArray,
      messages,
      severity: alert.severity,
      timestamp: timeAgo,
    });
  } catch (error) {
    console.error('Error fetching alert details:', error);
    return NextResponse.json({ error: 'Failed to fetch alert details' }, { status: 500 });
  }
}
