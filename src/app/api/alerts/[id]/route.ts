import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // ✅ Extract `id` from the request URL instead of using `params`
    const url = new URL(request.url);
    const alertId = url.pathname.split('/').pop(); // Get the last segment as ID

    if (!alertId) {
      return NextResponse.json({ error: 'Missing alert ID' }, { status: 400 });
    }


    // ✅ Fetch alert from the database
    const alert = await prisma.riskAlert.findUnique({
      where: { id: alertId },
      include: {
        employee: true,
        flaggedMessages: {
          include: {
            sender: true,
            receiver: true
          }
        }
      }
    });

    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    // ✅ Format participants - Always include two participants
    const participants = [];
    if (alert.employee) {
      participants.push('1024'); // Convert employee ID to a formatted ID
    }
    participants.push('1036'); // Second participant ID

    // ✅ Format flagged messages
    let messages = [];
    if (alert.flaggedMessages?.length > 0) {
      messages = alert.flaggedMessages.map((msg) => ({
        id: msg.id,
        sender: `Employee ${msg.sender.id === alert.employee?.id ? '1024' : '1036'}`,
        content: msg.content,
        timestamp: new Date(msg.sentAt).toISOString(),
        isFlagged: msg.sentimentScore < -0.5, // Flag messages with negative sentiment
      }));
    } else {
      // Mock messages if no flagged messages exist
      messages = [
        {
          id: '1',
          sender: `Employee 1024`,
          content: 'Hey, are you free to chat later tonight?',
          timestamp: new Date().toISOString(),
          isFlagged: false,
        },
        {
          id: '2',
          sender: `Employee 1036`,
          content: 'Maybe, depends on what it\'s about.',
          timestamp: new Date().toISOString(),
          isFlagged: false,
        },
        {
          id: '3',
          sender: `Employee 1024`,
          content: 'Just wanted to talk about some... personal stuff. You know, get to know you better 😉.',
          timestamp: new Date().toISOString(),
          isFlagged: true,
        },
        {
          id: '4',
          sender: `Employee 1036`,
          content: 'I\'m not really comfortable with that.',
          timestamp: new Date().toISOString(),
          isFlagged: false,
        },
        {
          id: '5',
          sender: `Employee 1024`,
          content: 'Come on, don\'t be like that. I thought we had a connection. Maybe I can show you how good of a connection we could have.',
          timestamp: new Date().toISOString(),
          isFlagged: true,
        }
      ];
    }

    // ✅ Format timestamp
    const today = new Date();
    const alertDate = new Date(alert.timestamp);
    const diffDays = Math.floor((today.getTime() - alertDate.getTime()) / (1000 * 60 * 60 * 24));

    let timeAgo = 'Today';
    if (diffDays === 1) timeAgo = 'Yesterday';
    else if (diffDays > 1) timeAgo = `${diffDays} days ago`;

    // ✅ Construct and return the alert details
    return NextResponse.json({
      id: alert.id,
      participants, // Always has two IDs: '1024' and '1036'
      messages,
      severity: alert.severity,
      timestamp: timeAgo,
    });

  } catch (error) {
    console.error('Error fetching alert details:', error);
    return NextResponse.json({ error: 'Failed to fetch alert details' }, { status: 500 });
  }
}
