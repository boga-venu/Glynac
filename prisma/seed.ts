import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

// Define a Record type for user records
interface UserRecord {
  id: string;
  [key: string]: any;
}

interface MessageData {
  sender: string;
  receiver: string;
  content: string;
  sentimentScore: number;
  isPositive: boolean;
  isNegative: boolean;
  isNeutral: boolean;
  channel: string;
}

async function main() {
  // Create departments
  const departments = [
    { name: 'Marketing' },
    { name: 'Engineering' },
    { name: 'Product' },
    { name: 'Finance' },
    { name: 'HR' },
    { name: 'Sales' },
  ];

  for (const department of departments) {
    await prisma.department.upsert({
      where: { name: department.name },
      update: {},
      create: department,
    });
  }

  // Create users
  const usersList = [
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      password: await hash('password123', 10),
      department: 'Marketing',
      position: 'Marketing Manager',
      imageUrl: null,
      isAdmin: false,
    },
    {
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      password: await hash('password123', 10),
      department: 'Engineering',
      position: 'Software Engineer',
      imageUrl: null,
      isAdmin: false,
    },
    {
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      password: await hash('password123', 10),
      department: 'Product',
      position: 'Product Manager',
      imageUrl: null,
      isAdmin: false,
    },
    {
      name: 'David Kim',
      email: 'david.kim@company.com',
      password: await hash('password123', 10),
      department: 'Finance',
      position: 'Financial Analyst',
      imageUrl: null,
      isAdmin: false,
    },
    {
      name: 'Alex Thompson',
      email: 'alex.thompson@company.com',
      password: await hash('password123', 10),
      department: 'Sales',
      position: 'Sales Representative',
      imageUrl: null,
      isAdmin: false,
    },
    {
      name: 'Admin User',
      email: 'admin@company.com',
      password: await hash('admin123', 10),
      department: 'HR',
      position: 'HR Director',
      imageUrl: null,
      isAdmin: true,
    },
    // Additional users for more data variety
    {
      name: 'James Wilson',
      email: 'james.wilson@company.com',
      password: await hash('password123', 10),
      department: 'Engineering',
      position: 'Senior Developer',
      imageUrl: null,
      isAdmin: false,
    },
    {
      name: 'Sophia Garcia',
      email: 'sophia.garcia@company.com',
      password: await hash('password123', 10),
      department: 'Marketing',
      position: 'Content Strategist',
      imageUrl: null,
      isAdmin: false,
    },
    {
      name: 'John Martinez',
      email: 'john.martinez@company.com',
      password: await hash('password123', 10),
      department: 'Sales',
      position: 'Account Executive',
      imageUrl: null,
      isAdmin: false,
    },
    {
      name: 'Emma Taylor',
      email: 'emma.taylor@company.com',
      password: await hash('password123', 10),
      department: 'Product',
      position: 'UX Designer',
      imageUrl: null,
      isAdmin: false,
    },
  ];

  // Create users and store their IDs
  const userRecords: Record<string, UserRecord> = {};
  for (const user of usersList) {
    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
    userRecords[user.name] = record;
  }
  
  // Create Glynac Scores (last 12 months for better trend visibility)
  const today = new Date();
  const scoreProgress = [72, 74, 75, 73, 77, 78, 76, 79, 81, 79, 82, 84]; // Shows improvement over time
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);
    
    await prisma.glynacScore.create({
      data: {
        date,
        overallScore: scoreProgress[i] || 70 + Math.floor(Math.random() * 10),
        communicationScore: 65 + Math.floor(Math.random() * 15),
        workloadScore: 75 + Math.floor(Math.random() * 10),
        wellbeingScore: 68 + Math.floor(Math.random() * 12),
      }
    });
  }
  
  // Enhanced message data with more variety and explicit abusive content for detection
  const messageData: MessageData[] = [
    // Original messages
    {
      sender: 'Sarah Johnson',
      receiver: 'Michael Chen',
      content: 'Can you get me that report by end of day?',
      sentimentScore: 0.2,
      isNeutral: true,
      isPositive: false,
      isNegative: false,
      channel: 'email',
    },
    {
      sender: 'Michael Chen',
      receiver: 'Sarah Johnson',
      content: 'Yes, I\'ll have it done by 5pm.',
      sentimentScore: 0.5,
      isPositive: true,
      isNeutral: false,
      isNegative: false,
      channel: 'email',
    },
    {
      sender: 'Sarah Johnson',
      receiver: 'Emily Rodriguez',
      content: 'I\'m really disappointed with the quality of work on this project.',
      sentimentScore: -0.7,
      isPositive: true,
      isNeutral: false,
      isNegative: false,
      channel: 'email',
    },
    {
      sender: 'Emily Rodriguez',
      receiver: 'Sarah Johnson',
      content: 'I understand your concerns and will improve it right away.',
      sentimentScore: 0.3,
      isPositive: true,
      isNeutral: false,
      isNegative: false,
      channel: 'email',
    },
    {
      sender: 'Alex Thompson',
      receiver: 'David Kim',
      content: 'This financial report is confusing. Can you simplify it?',
      sentimentScore: -0.2,
      isPositive: false,
      isNeutral: true,
      isNegative: false,
      channel: 'email',
    },
    
    // Additional messages with stronger negative sentiment and abusive language
    {
      sender: 'Alex Thompson',
      receiver: 'John Martinez',
      content: 'This is complete garbage work. Are you even trying? This is pathetic.',
      sentimentScore: -0.9,
      isPositive: false,
      isNeutral: false,
      isNegative: true,
      channel: 'slack',
    },
    {
      sender: 'John Martinez',
      receiver: 'Alex Thompson',
      content: 'Back off! I\'m sick of your constant criticism. You\'re a terrible manager!',
      sentimentScore: -0.85,
      isPositive: false,
      isNeutral: false,
      isNegative: true,
      channel: 'slack',
    },
    {
      sender: 'James Wilson',
      receiver: 'Michael Chen',
      content: 'You\'re an idiot if you think that solution will work. Learn to code properly.',
      sentimentScore: -0.8,
      isPositive: false,
      isNeutral: false,
      isNegative: true,
      channel: 'teams',
    },
    {
      sender: 'Sarah Johnson',
      receiver: 'Sophia Garcia',
      content: 'This presentation is worthless. Don\'t waste my time with this amateur work again.',
      sentimentScore: -0.75,
      isPositive: false,
      isNeutral: false,
      isNegative: true,
      channel: 'email',
    },
    {
      sender: 'James Wilson',
      receiver: 'Emma Taylor',
      content: 'Nobody cares about your opinion. Your designs are consistently terrible.',
      sentimentScore: -0.85,
      isPositive: false,
      isNeutral: false,
      isNegative: true,
      channel: 'slack',
    },
    
    // Add a pattern of harassment between specific employees
    {
      sender: 'James Wilson',
      receiver: 'Emily Rodriguez',
      content: 'Hey, you look nice today. We should grab drinks after work sometime.',
      sentimentScore: 0.1,
      isPositive: false,
      isNeutral: true,
      isNegative: false,
      channel: 'slack',
    },
    {
      sender: 'Emily Rodriguez',
      receiver: 'James Wilson',
      content: 'Thanks, but I\'d prefer to keep our relationship professional.',
      sentimentScore: -0.1,
      isPositive: false,
      isNeutral: true,
      isNegative: false,
      channel: 'slack',
    },
    {
      sender: 'James Wilson',
      receiver: 'Emily Rodriguez',
      content: 'Come on, don\'t be like that. I\'m just trying to be friendly. You\'re too uptight.',
      sentimentScore: -0.4,
      isPositive: false,
      isNeutral: false,
      isNegative: true,
      channel: 'slack',
    },
    {
      sender: 'James Wilson',
      receiver: 'Emily Rodriguez',
      content: 'Fine, your loss. I was just trying to be nice but if you want to be cold that\'s on you.',
      sentimentScore: -0.6,
      isPositive: false,
      isNeutral: false,
      isNegative: true,
      channel: 'slack',
    },
    {
      sender: 'James Wilson',
      receiver: 'Emily Rodriguez',
      content: 'You know, your presentation would have gone better if you had dressed more professionally.',
      sentimentScore: -0.5,
      isPositive: false,
      isNeutral: false,
      isNegative: true,
      channel: 'email',
    },
    
    // Add more neutral and positive messages for balance
    {
      sender: 'David Kim',
      receiver: 'Alex Thompson',
      content: 'Sure, I\'ll revise it with clearer explanations.',
      sentimentScore: 0.4,
      isPositive: true,
      isNeutral: false,
      isNegative: false,
      channel: 'email',
    },
    {
      sender: 'Sarah Johnson',
      receiver: 'Admin User',
      content: 'The deadline for this project is ridiculous! We need more time.',
      sentimentScore: -0.8,
      isPositive: false,
      isNeutral: false,
      isNegative: true,
      channel: 'email',
    },
    {
      sender: 'Admin User',
      receiver: 'Sarah Johnson',
      content: 'Let\'s discuss this in our next meeting to find a solution.',
      sentimentScore: 0.1,
      isPositive: false,
      isNeutral: true,
      isNegative: false,
      channel: 'email',
    },
    {
      sender: 'Michael Chen',
      receiver: 'Emily Rodriguez',
      content: 'Great job on the product spec, very thorough!',
      sentimentScore: 0.9,
      isPositive: true,
      isNeutral: false,
      isNegative: false,
      channel: 'slack',
    },
    {
      sender: 'David Kim',
      receiver: 'Michael Chen',
      content: 'Could you explain how this feature affects our budget?',
      sentimentScore: 0.0,
      isPositive: false,
      isNeutral: true,
      isNegative: false,
      channel: 'email',
    },
    
    // Add messages with repeated topics/concerns for pattern detection
    {
      sender: 'Sarah Johnson',
      receiver: 'Admin User',
      content: 'We really need to talk about the Q2 budget constraints. This is becoming a serious problem.',
      sentimentScore: -0.4,
      isPositive: false,
      isNeutral: false,
      isNegative: true,
      channel: 'email',
    },
    {
      sender: 'Sarah Johnson',
      receiver: 'David Kim',
      content: 'Can we revisit the Q2 budget constraints? We can\'t deliver with these limitations.',
      sentimentScore: -0.5,
      isPositive: false,
      isNeutral: false,
      isNegative: true,
      channel: 'email',
    },
    {
      sender: 'Sarah Johnson',
      receiver: 'Admin User',
      content: 'I\'m bringing up the Q2 budget constraints again because we haven\'t resolved this.',
      sentimentScore: -0.6,
      isPositive: false,
      isNeutral: false,
      isNegative: true,
      channel: 'email',
    },
    {
      sender: 'Michael Chen',
      receiver: 'Emily Rodriguez',
      content: 'The project timeline is too aggressive. We need more development time.',
      sentimentScore: -0.3,
      isPositive: false,
      isNeutral: false,
      isNegative: true,
      channel: 'email',
    },
    {
      sender: 'Michael Chen',
      receiver: 'Sarah Johnson',
      content: 'As I mentioned before, the project timeline is unrealistic for what you\'re asking.',
      sentimentScore: -0.4,
      isPositive: false,
      isNeutral: false,
      isNegative: true,
      channel: 'email',
    },
    {
      sender: 'Michael Chen',
      receiver: 'Admin User',
      content: 'I have to escalate this - the project timeline keeps getting compressed despite my concerns.',
      sentimentScore: -0.5,
      isPositive: false,
      isNeutral: false,
      isNegative: true,
      channel: 'email',
    },
    {
      sender: 'Alex Thompson',
      receiver: 'David Kim',
      content: 'We need to address the resource allocation issues in the sales department.',
      sentimentScore: -0.3,
      isPositive: false,
      isNeutral: false,
      isNegative: true,
      channel: 'email',
    },
    {
      sender: 'Alex Thompson',
      receiver: 'Admin User',
      content: 'Following up on resource allocation - this is becoming a serious blocker for sales.',
      sentimentScore: -0.4,
      isPositive: false,
      isNeutral: false,
      isNegative: true,
      channel: 'email',
    },
    {
      sender: 'Emma Taylor',
      receiver: 'Emily Rodriguez',
      content: 'I\'m concerned about design feedback being ignored in the development process.',
      sentimentScore: -0.3,
      isPositive: false,
      isNeutral: false,
      isNegative: true,
      channel: 'email',
    },
    {
      sender: 'Emma Taylor',
      receiver: 'Michael Chen',
      content: 'Once again, the design feedback is not being incorporated into the build.',
      sentimentScore: -0.4,
      isPositive: false,
      isNeutral: false,
      isNegative: true,
      channel: 'email',
    },
  ];
  
  // Create 50 more neutral/positive messages to have a reasonable volume of communications
  const commonPhrases = [
    "Let's discuss this at our next meeting.",
    "Thanks for the update!",
    "I'll review this and get back to you.",
    "Looks good to me.",
    "Can we schedule some time to go over this?",
    "I've completed the task you assigned.",
    "Do you have any questions about my report?",
    "I'll need a bit more time to finish this.",
    "Great work on this project!",
    "Just checking in on the status of this.",
  ];
  
  const allEmployees = Object.keys(userRecords);
  
  // For the dynamic message generation code, change it to:
for (let i = 0; i < 50; i++) {
  const senderIndex = Math.floor(Math.random() * allEmployees.length);
  let receiverIndex = Math.floor(Math.random() * allEmployees.length);
  
  // Ensure sender and receiver are different
  while (receiverIndex === senderIndex) {
    receiverIndex = Math.floor(Math.random() * allEmployees.length);
  }
  
  const sender = allEmployees[senderIndex];
  const receiver = allEmployees[receiverIndex];
  
  const phraseIndex = Math.floor(Math.random() * commonPhrases.length);
  const content = commonPhrases[phraseIndex];
  
  // Randomize sentiment slightly
  const sentimentScore = Math.random() * 0.6; // 0 to 0.6 (neutral to positive)
  
  const isPositive = sentimentScore > 0.3;
  const isNeutral = !isPositive;
  
  const channels = ['email', 'slack', 'teams'];
  const channelIndex = Math.floor(Math.random() * channels.length);
  
  messageData.push({
    sender,
    receiver,
    content,
    sentimentScore,
    isPositive,
    isNeutral,
    isNegative: false, // Explicitly set false since these are neutral or positive messages
    channel: channels[channelIndex],
  });
}
  
  // Add timestamps over the last 3 months for a realistic distribution
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  // Create all messages with different timestamps
  for (const message of messageData) {
    // Generate random date between now and 3 months ago
    const randomTime = threeMonthsAgo.getTime() + Math.random() * (today.getTime() - threeMonthsAgo.getTime());
    const sentAt = new Date(randomTime);
    
    await prisma.message.create({
      data: {
        content: message.content,
        sentimentScore: message.sentimentScore,
        isPositive: !!message.isPositive,
        isNegative: !!message.isNegative,
        isNeutral: !!message.isNeutral,
        channel: message.channel,
        sentAt,
        sender: { connect: { id: userRecords[message.sender].id } },
        receiver: { connect: { id: userRecords[message.receiver].id } },
      }
    });
  }
  
  // Enhanced risk alerts with more variety
  const riskData = [
    // Original risk alerts
    {
      employee: 'Sarah Johnson',
      type: 'burnout',
      title: 'Burnout Risk for Sarah Johnson',
      description: 'Working consistently past 9 PM for the last 14 days',
      severity: 'high',
    },
    {
      employee: 'Michael Chen',
      type: 'security',
      title: 'Unusual File Access Pattern',
      description: 'Accessed 47 confidential documents in 1 hour',
      severity: 'medium',
    },
    {
      employee: 'Emily Rodriguez',
      type: 'complaint',
      title: 'Complaint from Team Member',
      description: 'Received complaint about project management approach',
      severity: 'low',
    },
    {
      employee: 'Alex Thompson',
      type: 'harassment',
      title: 'Potential Harassment Incident',
      description: 'Concerning messages detected in chat history',
      severity: 'high',
    },
    {
      employee: 'David Kim',
      type: 'calendar_overload',
      title: 'Calendar Alert',
      description: 'Increasing meeting load detected',
      severity: 'medium',
    },
    
    // Additional harassment risks
    {
      employee: 'James Wilson',
      type: 'harassment',
      title: 'Harassment Alert',
      description: 'Multiple uncomfortable messages sent to Emily Rodriguez',
      severity: 'high',
    },
    {
      employee: 'James Wilson',
      type: 'harassment',
      title: 'Inappropriate Comments',
      description: 'Pattern of personal comments towards female colleagues',
      severity: 'high',
    },
    {
      employee: 'Sarah Johnson',
      type: 'harassment',
      title: 'Aggressive Communication',
      description: 'Unusually harsh criticism detected in communications',
      severity: 'medium',
    },
    
    // Additional security risks
    {
      employee: 'Michael Chen',
      type: 'security',
      title: 'Company Policy Violation',
      description: 'Shared company documents to personal email',
      severity: 'high',
    },
    {
      employee: 'John Martinez',
      type: 'security',
      title: 'Data Export Alert',
      description: 'Large volume of data exported after hours',
      severity: 'high',
    },
    {
      employee: 'Alex Thompson',
      type: 'security',
      title: 'Suspicious Access Pattern',
      description: 'Accessed HR files outside of normal workflow',
      severity: 'medium',
    },
    {
      employee: 'Emma Taylor',
      type: 'security',
      title: 'Password Sharing',
      description: 'Evidence of password sharing in team chat',
      severity: 'medium',
    },
    
    // Additional burnout risks
    {
      employee: 'Sophia Garcia',
      type: 'burnout',
      title: 'Burnout Risk',
      description: 'Working weekends for the past 3 weeks',
      severity: 'medium',
    },
    {
      employee: 'Michael Chen',
      type: 'burnout',
      title: 'Overwork Alert',
      description: 'Logged over 60 hours per week for the past month',
      severity: 'high',
    },
    {
      employee: 'Emma Taylor',
      type: 'burnout',
      title: 'No Break Pattern',
      description: 'No lunch breaks recorded for two weeks',
      severity: 'medium',
    },
    
    // Additional complaint risks
    {
      employee: 'John Martinez',
      type: 'complaint',
      title: 'Client Complaint',
      description: 'Client reported aggressive tone in communications',
      severity: 'medium',
    },
    {
      employee: 'Sophia Garcia',
      type: 'complaint',
      title: 'Missed Deadlines Reported',
      description: 'Multiple team members reported missed handoffs',
      severity: 'medium',
    },
    
    // Additional calendar overload
    {
      employee: 'Sophia Garcia',
      type: 'calendar_overload',
      title: 'Meeting Overload',
      description: '35+ hours in meetings this week with no focus time',
      severity: 'high',
    },
    {
      employee: 'Sarah Johnson',
      type: 'calendar_overload',
      title: 'Back-to-Back Meetings',
      description: 'No breaks between meetings for 8+ hours',
      severity: 'medium',
    },
  ];
  
  for (const risk of riskData) {
    // Generate random date in the last month
    const randomDays = Math.floor(Math.random() * 30);
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - randomDays);
    
    await prisma.riskAlert.create({
      data: {
        type: risk.type,
        title: risk.title,
        description: risk.description,
        severity: risk.severity,
        timestamp,
        employee: { connect: { id: userRecords[risk.employee].id } },
      }
    });
  }
  
  // Creating additional messages with flagged content to connect to harassment alerts
  const harassmentAlerts = await prisma.riskAlert.findMany({
    where: {
      type: 'harassment'
    }
  });
  
  // For each harassment alert, connect relevant messages
  for (const alert of harassmentAlerts) {
    // Find messages with negative sentiment from the employee with this alert
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: alert.employeeId,
            isNegative: true
          }
        ]
      },
      take: 3 // Connect up to 3 messages per alert
    });
    
    // Connect these messages to the alert
    for (const message of messages) {
      await prisma.riskAlert.update({
        where: {
          id: alert.id
        },
        data: {
          flaggedMessages: {
            connect: { id: message.id }
          }
        }
      });
    }
  }
  
  // Create calendar items for each user
  const now = new Date();
  const userNames = Object.keys(userRecords).filter(name => name !== 'Admin User');
  
  for (const userName of userNames) {
    // Create different numbers of meetings based on their workload
    let meetingCount = 0;
    if (userName === 'Sarah Johnson') meetingCount = 35;
    else if (userName === 'Michael Chen') meetingCount = 20;
    else if (userName === 'Emily Rodriguez') meetingCount = 18;
    else if (userName === 'David Kim') meetingCount = 10;
    else if (userName === 'Sophia Garcia') meetingCount = 38; // Very high meeting load
    else if (userName === 'James Wilson') meetingCount = 25;
    else if (userName === 'John Martinez') meetingCount = 30;
    else if (userName === 'Emma Taylor') meetingCount = 22;
    else meetingCount = 28;
    
    for (let i = 0; i < meetingCount; i++) {
      const startTime = new Date(now);
      startTime.setDate(startTime.getDate() + Math.floor(Math.random() * 14));  // Next 2 weeks
      startTime.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0);  // Between 9am and 5pm
      
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1);  // 1-hour meeting
      
      await prisma.calendarItem.create({
        data: {
          title: `Meeting ${i + 1}`,
          description: `Description for meeting ${i + 1}`,
          startTime,
          endTime,
          isRecurring: Math.random() > 0.7,
          isOptional: Math.random() > 0.8,
          isFocusTime: false,
          user: { connect: { id: userRecords[userName].id } },
        }
      });
    }
    
    // Add focus time blocks
    let focusBlockCount = 0;
    if (userName === 'Sarah Johnson') focusBlockCount = 2;
    else if (userName === 'Michael Chen') focusBlockCount = 8;
    else if (userName === 'Emily Rodriguez') focusBlockCount = 10;
    else if (userName === 'David Kim') focusBlockCount = 15;
    else if (userName === 'Sophia Garcia') focusBlockCount = 3; // Very little focus time
    else if (userName === 'James Wilson') focusBlockCount = 7;
    else if (userName === 'John Martinez') focusBlockCount = 5;
    else if (userName === 'Emma Taylor') focusBlockCount = 9;
    else focusBlockCount = 5;
    
    for (let i = 0; i < focusBlockCount; i++) {
      const startTime = new Date(now);
      startTime.setDate(startTime.getDate() + Math.floor(Math.random() * 14));
      startTime.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 2);  // 2-hour focus block
      
      await prisma.calendarItem.create({
        data: {
          title: `Focus Time`,
          description: `Focused work period`,
          startTime,
          endTime,
          isRecurring: false,
          isOptional: false,
          isFocusTime: true,
          user: { connect: { id: userRecords[userName].id } },
        }
      });
    }
  }
  
  // Create performance data for each user with more variety
  for (const userName of userNames) {
    let respondTime = 0;
    let taskCompletionRate = 0;
    let communicationVolume = 0;
    let negativityScore = 0;
    let meetingAttendance = 0;
    let overdueTasks = 0;
    
    if (userName === 'Sarah Johnson') {
      respondTime = 4.2;
      taskCompletionRate = 82;
      communicationVolume = 65;
      negativityScore = 0.35;
      meetingAttendance = 95;
      overdueTasks = 3;
    } else if (userName === 'Michael Chen') {
      respondTime = 2.1;
      taskCompletionRate = 90;
      communicationVolume = 45;
      negativityScore = 0.15;
      meetingAttendance = 98;
      overdueTasks = 1;
    } else if (userName === 'Emily Rodriguez') {
      respondTime = 1.5;
      taskCompletionRate = 95;
      communicationVolume = 55;
      negativityScore = 0.05;
      meetingAttendance = 100;
      overdueTasks = 0;
    } else if (userName === 'David Kim') {
      respondTime = 3.0;
      taskCompletionRate = 88;
      communicationVolume = 25;
      negativityScore = 0.08;
      meetingAttendance = 92;
      overdueTasks = 1;
    } else if (userName === 'James Wilson') {
      respondTime = 5.8; // Very slow to respond
      taskCompletionRate = 70;
      communicationVolume = 30;
      negativityScore = 0.45; // Highly negative
      meetingAttendance = 85;
      overdueTasks = 7; // Many overdue tasks
    } else if (userName === 'Sophia Garcia') {
      respondTime = 2.7;
      taskCompletionRate = 85;
      communicationVolume = 60;
      negativityScore = 0.18;
      meetingAttendance = 95;
      overdueTasks = 2;
    } else if (userName === 'John Martinez') {
      respondTime = 6.2; // Very slow to respond
      taskCompletionRate = 65;
      communicationVolume = 15; // Low communication volume
      negativityScore = 0.30;
      meetingAttendance = 80;
      overdueTasks = 5;
    } else if (userName === 'Emma Taylor') {
      respondTime = 2.3;
      taskCompletionRate = 92;
      communicationVolume = 50;
      negativityScore = 0.12;
      meetingAttendance = 98;
      overdueTasks = 1;
    } else {
      respondTime = 4.8;
      taskCompletionRate = 75;
      communicationVolume = 40;
      negativityScore = 0.28;
      meetingAttendance = 85;
      overdueTasks = 4;
    }
    
    let performanceData = await prisma.performanceData.upsert({
      where: { userId: userRecords[userName].id },
      update: {
        respondTime,
        taskCompletionRate,
        communicationVolume,
        negativityScore,
        meetingAttendance,
        overdueTasks,
      },
      create: {
        respondTime,
        taskCompletionRate,
        communicationVolume,
        negativityScore,
        meetingAttendance,
        overdueTasks,
        user: { connect: { id: userRecords[userName].id } },
      }
    });
    
    // Create daily performance records for the past 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Add some variance to the base values
      const commVariance = Math.floor(Math.random() * 10) - 5;  // -5 to +5
      const negVariance = (Math.random() * 0.1) - 0.05;  // -0.05 to +0.05
      
      await prisma.dailyPerformance.create({
        data: {
          date,
          communicationVolume: performanceData.communicationVolume + commVariance,
          negativityScore: Math.min(Math.max(performanceData.negativityScore + negVariance, 0), 1),
          performanceData: { connect: { id: performanceData.id } },
        }
      });
    }
  }
  
  // Create retention data for each user with more realistic retention risks
  for (const userName of userNames) {
    let retentionRisk = 0;
    let complaintCount = 0;
    let calendarOverload = false;
    let positiveLanguage = 0;
    let negativeLanguage = 0;
    let meetingLoad = 0;
    
    if (userName === 'Sarah Johnson') {
      retentionRisk = 75;  // High risk
      complaintCount = 2;
      calendarOverload = true;
      positiveLanguage = 55;
      negativeLanguage = 15;
      meetingLoad = 35;
    } else if (userName === 'Michael Chen') {
      retentionRisk = 35;
      complaintCount = 1;
      calendarOverload = false;
      positiveLanguage = 75;
      negativeLanguage = 5;
      meetingLoad = 20;
    } else if (userName === 'Emily Rodriguez') {
      retentionRisk = 15;
      complaintCount = 0;
      calendarOverload = false;
      positiveLanguage = 90;
      negativeLanguage = 2;
      meetingLoad = 18;
    } else if (userName === 'David Kim') {
      retentionRisk = 10;
      complaintCount = 0;
      calendarOverload = false;
      positiveLanguage = 85;
      negativeLanguage = 3;
      meetingLoad = 10;
    } else if (userName === 'James Wilson') {
      retentionRisk = 82;  // Very high risk
      complaintCount = 3;
      calendarOverload = false;
      positiveLanguage = 40;
      negativeLanguage = 25;  // High negative language
      meetingLoad = 25;
    } else if (userName === 'Sophia Garcia') {
      retentionRisk = 68;  // High risk
      complaintCount = 1;
      calendarOverload = true;
      positiveLanguage = 60;
      negativeLanguage = 12;
      meetingLoad = 38;  // Very high meeting load
    } else if (userName === 'John Martinez') {
      retentionRisk = 45;
      complaintCount = 2;
      calendarOverload = false;
      positiveLanguage = 65;
      negativeLanguage = 10;
      meetingLoad = 30;
    } else if (userName === 'Emma Taylor') {
      retentionRisk = 22;
      complaintCount = 0;
      calendarOverload = false;
      positiveLanguage = 80;
      negativeLanguage = 5;
      meetingLoad = 22;
    } else {
      retentionRisk = 45;
      complaintCount = 1;
      calendarOverload = false;
      positiveLanguage = 65;
      negativeLanguage = 10;
      meetingLoad = 28;
    }
    
    let retentionData = await prisma.retentionData.upsert({
      where: { userId: userRecords[userName].id },
      update: {
        retentionRisk,
        complaintCount,
        calendarOverload,
        positiveLanguage,
        negativeLanguage,
        meetingLoad,
      },
      create: {
        retentionRisk,
        complaintCount,
        calendarOverload,
        positiveLanguage,
        negativeLanguage,
        meetingLoad,
        user: { connect: { id: userRecords[userName].id } },
      }
    });
    
    // Create monthly retention data for the past 6 months showing trends
    for (let i = 0; i < 6; i++) {
      const month = new Date();
      month.setMonth(month.getMonth() - i);
      
      // For high-risk employees, show deteriorating trends
      let complaintTrend = 0;
      let positiveTrend = 0;
      let negativeTrend = 0;
      
      if (retentionRisk > 60) {
        // For high-risk employees, complaints increase and sentiment worsens over time
        complaintTrend = -Math.floor(i/2);
        positiveTrend = i * 3; // Positive language was higher in the past
        negativeTrend = -i * 2; // Negative language was lower in the past
      } else if (retentionRisk > 40) {
        // For medium-risk employees, slight deterioration
        complaintTrend = -Math.floor(i/3);
        positiveTrend = i * 1.5;
        negativeTrend = -i * 1;
      } else {
        // For low-risk employees, stable or improving trends
        complaintTrend = 0;
        positiveTrend = -i * 1; // Positive language was lower in the past
        negativeTrend = i * 0.5; // Negative language was higher in the past
      }
      
      await prisma.monthlyRetention.create({
        data: {
          month,
          complaintCount: Math.max(0, retentionData.complaintCount + complaintTrend),
          positiveLanguage: Math.max(0, Math.min(100, retentionData.positiveLanguage + positiveTrend)),
          negativeLanguage: Math.max(0, Math.min(100, retentionData.negativeLanguage + negativeTrend)),
          retentionData: { connect: { id: retentionData.id } },
        }
      });
    }
  }

  // Create some files with more diversity for security risk detection
  const fileTypes = ['docx', 'xlsx', 'pdf', 'pptx', 'txt'];
  const creators = ['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim', 'Alex Thompson', 'James Wilson', 'Sophia Garcia'];
  
  // Create confidential files first
  const confidentialFiles = [
    'CompanyStrategy2024.pptx',
    'SalaryData.xlsx',
    'CustomerDatabase_Export.xlsx',
    'ProductRoadmap_Confidential.pdf',
    'HR_EmployeeRecords.xlsx',
    'AcquisitionPlans.docx',
    'FinancialForecast.xlsx',
    'ExecutiveCompensation.pdf',
    'InvestorRelations.pptx',
    'CompetitorAnalysis.docx'
  ];
  
  for (const fileName of confidentialFiles) {
    const fileExt = fileName.split('.').pop() || 'docx';
    const creatorIndex = Math.floor(Math.random() * creators.length);
    
    const file = await prisma.file.create({
      data: {
        name: fileName,
        type: fileExt,
        size: Math.floor(Math.random() * 5000000) + 10000, // Random size between 10KB and 5MB
        path: `/documents/confidential/${fileName}`,
        createdAt: new Date(today.getTime() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000), // Random date in last 90 days
        lastModified: new Date(today.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random date in last 30 days
        creatorId: userRecords[creators[creatorIndex]].id
      }
    });
  }
  
  // Create regular files
  for (let i = 0; i < 20; i++) {
    const creatorIndex = Math.floor(Math.random() * creators.length);
    const typeIndex = Math.floor(Math.random() * fileTypes.length);
    
    const file = await prisma.file.create({
      data: {
        name: `Document_${i + 1}.${fileTypes[typeIndex]}`,
        type: fileTypes[typeIndex],
        size: Math.floor(Math.random() * 5000000) + 10000, // Random size between 10KB and 5MB
        path: `/documents/doc_${i + 1}.${fileTypes[typeIndex]}`,
        createdAt: new Date(today.getTime() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000), // Random date in last 90 days
        lastModified: new Date(today.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random date in last 30 days
        creatorId: userRecords[creators[creatorIndex]].id
      }
    });
    
    // Create 1-3 file activities for each file
    const activityCount = Math.floor(Math.random() * 3) + 1;
    const actions = ['view', 'edit', 'download', 'share'];
    
    for (let j = 0; j < activityCount; j++) {
      const userIndex = Math.floor(Math.random() * userNames.length);
      const actionIndex = Math.floor(Math.random() * actions.length);
      
      await prisma.fileActivity.create({
        data: {
          action: actions[actionIndex],
          timestamp: new Date(today.getTime() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000), // Random date in last 14 days
          fileId: file.id,
          userId: userRecords[userNames[userIndex]].id
        }
      });
    }
  }
  
  // Create suspicious file activity for security risk users
  const confidentialFileIds = await prisma.file.findMany({
    where: {
      path: {
        contains: 'confidential'
      }
    },
    select: {
      id: true
    }
  });
  
  // Create a pattern of file access for specific users with security risks
  const highRiskSecurityUsers = ['Michael Chen', 'John Martinez'];
  
  for (const userName of highRiskSecurityUsers) {
    // Create multiple accesses to confidential files
    for (const fileId of confidentialFileIds) {
      // Create between 3-8 access events for suspicious pattern
      const accessCount = Math.floor(Math.random() * 5) + 3;
      
      for (let i = 0; i < accessCount; i++) {
        // Create activity in a short timeframe (last 24 hours)
        const accessTime = new Date();
        accessTime.setHours(accessTime.getHours() - Math.random() * 24);
        
        await prisma.fileActivity.create({
          data: {
            action: Math.random() > 0.5 ? 'view' : 'download', // Mostly viewing and downloading
            timestamp: accessTime,
            fileId: fileId.id,
            userId: userRecords[userName].id
          }
        });
      }
    }
  }

  console.log('Database has been seeded with enhanced data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });