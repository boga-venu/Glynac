// src/app/dashboard/page.tsx
'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlynacScoreCard } from '@/components/dashboard/glynac-score-card'
import { RiskAlerts } from '@/components/dashboard/risk-alerts'
import { SentimentAnalysis } from '@/components/dashboard/sentiment-analysis'
import { WorkloadAnalysis } from '@/components/dashboard/workload-analysis'
import { FileActivity } from '@/components/dashboard/file-activity'
import { EmployeeInsights } from '@/components/dashboard/employee-insights'
import { EmployeeDetailsModal } from '@/components/dashboard/employee-details-modal'
import { HarassmentDetailsModal } from '@/components/dashboard/harassment-details-modal'
import { 
  useGlynacScore, 
  useRiskAlerts, 
  useSentimentAnalysis, 
  useWorkloadAnalysis,
  useFileActivity,
  useEmployeeInsights,
  fetchEmployeeDetails,
  fetchHarassmentDetails
} from '@/hooks/use-dashboard-data'

export default function DashboardPage() {
  // State for modals
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null)
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null)
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false)
  const [harassmentModalOpen, setHarassmentModalOpen] = useState(false)

  // Fetch dashboard data
  const { data: glynacScore, isLoading: isLoadingScore } = useGlynacScore()
  const { data: riskAlerts, isLoading: isLoadingAlerts } = useRiskAlerts()
  const { data: sentimentData, isLoading: isLoadingSentiment } = useSentimentAnalysis()
  const { data: workloadData, isLoading: isLoadingWorkload } = useWorkloadAnalysis()
  const { data: fileActivity, isLoading: isLoadingFiles } = useFileActivity()
  const { data: employees, isLoading: isLoadingEmployees } = useEmployeeInsights()

  // Handle modal opens
  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployeeId(employeeId)
    setEmployeeModalOpen(true)
  }

  const handleViewAlertDetails = (alertId: string) => {
    setSelectedAlertId(alertId)
    setHarassmentModalOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
        {/* Glynac Score Card */}
        <div className="md:col-span-1 lg:col-span-4">
          {isLoadingScore ? (
            <div className="h-64 rounded-lg bg-gray-100 animate-pulse" />
          ) : glynacScore ? (
            <GlynacScoreCard
              overallScore={glynacScore.overallScore}
              communicationScore={glynacScore.communicationScore}
              workloadScore={glynacScore.workloadScore}
              wellbeingScore={glynacScore.wellbeingScore}
              trend={glynacScore.trend}
            />
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50">
              <p className="text-gray-500">No Glynac score data available</p>
            </div>
          )}
        </div>

        {/* Risk Alerts */}
        <div className="md:col-span-1 lg:col-span-8">
          {isLoadingAlerts ? (
            <div className="h-64 rounded-lg bg-gray-100 animate-pulse" />
          ) : riskAlerts ? (
            <RiskAlerts
              alerts={riskAlerts}
              onViewDetails={handleViewAlertDetails}
            />
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50">
              <p className="text-gray-500">No risk alerts available</p>
            </div>
          )}
        </div>

        {/* Sentiment Analysis */}
        <div className="md:col-span-1 lg:col-span-6">
          {isLoadingSentiment ? (
            <div className="h-96 rounded-lg bg-gray-100 animate-pulse" />
          ) : sentimentData ? (
            <SentimentAnalysis
              data={sentimentData.data}
              positivePercentage={sentimentData.positivePercentage}
              neutralPercentage={sentimentData.neutralPercentage}
              negativePercentage={sentimentData.negativePercentage}
            />
          ) : (
            <div className="flex h-96 items-center justify-center rounded-lg bg-gray-50">
              <p className="text-gray-500">No sentiment data available</p>
            </div>
          )}
        </div>

        {/* Workload Analysis */}
        <div className="md:col-span-1 lg:col-span-6">
          {isLoadingWorkload ? (
            <div className="h-96 rounded-lg bg-gray-100 animate-pulse" />
          ) : workloadData ? (
            <WorkloadAnalysis
              data={workloadData.data}
              avgMeetingHours={workloadData.avgMeetingHours}
              afterHoursPercentage={workloadData.afterHoursPercentage}
              avgFocusBlocks={workloadData.avgFocusBlocks}
            />
          ) : (
            <div className="flex h-96 items-center justify-center rounded-lg bg-gray-50">
              <p className="text-gray-500">No workload data available</p>
            </div>
          )}
        </div>

        {/* File Activity */}
        <div className="md:col-span-1 lg:col-span-6">
          {isLoadingFiles ? (
            <div className="h-96 rounded-lg bg-gray-100 animate-pulse" />
          ) : fileActivity ? (
            <FileActivity files={fileActivity} />
          ) : (
            <div className="flex h-96 items-center justify-center rounded-lg bg-gray-50">
              <p className="text-gray-500">No file activity data available</p>
            </div>
          )}
        </div>

        {/* Employee Insights */}
        <div className="md:col-span-1 lg:col-span-6">
          {isLoadingEmployees ? (
            <div className="h-96 rounded-lg bg-gray-100 animate-pulse" />
          ) : employees ? (
            <EmployeeInsights
              employees={employees}
              onSelectEmployee={handleSelectEmployee}
            />
          ) : (
            <div className="flex h-96 items-center justify-center rounded-lg bg-gray-50">
              <p className="text-gray-500">No employee data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <EmployeeDetailsModal
        employeeId={selectedEmployeeId}
        isOpen={employeeModalOpen}
        onClose={() => setEmployeeModalOpen(false)}
        fetchEmployeeDetails={fetchEmployeeDetails}
      />

      <HarassmentDetailsModal
        alertId={selectedAlertId}
        isOpen={harassmentModalOpen}
        onClose={() => setHarassmentModalOpen(false)}
        fetchHarassmentDetails={fetchHarassmentDetails}
      />
    </DashboardLayout>
  )
}