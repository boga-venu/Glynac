-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "imageUrl" TEXT,
    "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentimentScore" DOUBLE PRECISION NOT NULL,
    "isNegative" BOOLEAN NOT NULL DEFAULT false,
    "isPositive" BOOLEAN NOT NULL DEFAULT false,
    "isNeutral" BOOLEAN NOT NULL DEFAULT false,
    "channel" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "isFocusTime" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CalendarItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileActivity" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FileActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskAlert" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "RiskAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceData" (
    "id" TEXT NOT NULL,
    "respondTime" DOUBLE PRECISION NOT NULL,
    "taskCompletionRate" DOUBLE PRECISION NOT NULL,
    "communicationVolume" INTEGER NOT NULL,
    "negativityScore" DOUBLE PRECISION NOT NULL,
    "meetingAttendance" DOUBLE PRECISION NOT NULL,
    "overdueTasks" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PerformanceData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyPerformance" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "communicationVolume" INTEGER NOT NULL,
    "negativityScore" DOUBLE PRECISION NOT NULL,
    "performanceDataId" TEXT NOT NULL,

    CONSTRAINT "DailyPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RetentionData" (
    "id" TEXT NOT NULL,
    "retentionRisk" DOUBLE PRECISION NOT NULL,
    "complaintCount" INTEGER NOT NULL,
    "calendarOverload" BOOLEAN NOT NULL DEFAULT false,
    "positiveLanguage" DOUBLE PRECISION NOT NULL,
    "negativeLanguage" DOUBLE PRECISION NOT NULL,
    "meetingLoad" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RetentionData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyRetention" (
    "id" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "complaintCount" INTEGER NOT NULL,
    "positiveLanguage" DOUBLE PRECISION NOT NULL,
    "negativeLanguage" DOUBLE PRECISION NOT NULL,
    "retentionDataId" TEXT NOT NULL,

    CONSTRAINT "MonthlyRetention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlynacScore" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "communicationScore" DOUBLE PRECISION NOT NULL,
    "workloadScore" DOUBLE PRECISION NOT NULL,
    "wellbeingScore" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GlynacScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FlaggedMessages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FlaggedMessages_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PerformanceData_userId_key" ON "PerformanceData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RetentionData_userId_key" ON "RetentionData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE INDEX "_FlaggedMessages_B_index" ON "_FlaggedMessages"("B");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarItem" ADD CONSTRAINT "CalendarItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileActivity" ADD CONSTRAINT "FileActivity_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileActivity" ADD CONSTRAINT "FileActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskAlert" ADD CONSTRAINT "RiskAlert_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceData" ADD CONSTRAINT "PerformanceData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyPerformance" ADD CONSTRAINT "DailyPerformance_performanceDataId_fkey" FOREIGN KEY ("performanceDataId") REFERENCES "PerformanceData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetentionData" ADD CONSTRAINT "RetentionData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyRetention" ADD CONSTRAINT "MonthlyRetention_retentionDataId_fkey" FOREIGN KEY ("retentionDataId") REFERENCES "RetentionData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FlaggedMessages" ADD CONSTRAINT "_FlaggedMessages_A_fkey" FOREIGN KEY ("A") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FlaggedMessages" ADD CONSTRAINT "_FlaggedMessages_B_fkey" FOREIGN KEY ("B") REFERENCES "RiskAlert"("id") ON DELETE CASCADE ON UPDATE CASCADE;
