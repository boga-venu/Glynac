// src/components/dashboard/workload-analysis.tsx
'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WorkloadData {
  department: string
  meetingHours: number
  afterHours: number
}

interface WorkloadAnalysisProps {
  data: WorkloadData[]
  avgMeetingHours: number
  afterHoursPercentage: number
  avgFocusBlocks: number
}

export function WorkloadAnalysis({
  data,
  avgMeetingHours,
  afterHoursPercentage,
  avgFocusBlocks,
}: WorkloadAnalysisProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Calendar & Workload Analysis</CardTitle>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            Team <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="department" />
              <YAxis 
                label={{ value: 'Hours per Week', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="meetingHours" 
                name="Meeting Hours" 
                fill="#3498db" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="afterHours" 
                name="After-Hours Work" 
                fill="#9b59b6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="rounded-md bg-blue-50 p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{avgMeetingHours}</div>
            <div className="text-sm text-gray-600">Avg Meeting Hours/Week</div>
          </div>
          <div className="rounded-md bg-purple-50 p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">{afterHoursPercentage}%</div>
            <div className="text-sm text-gray-600">After-Hours Work</div>
          </div>
          <div className="rounded-md bg-green-50 p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{avgFocusBlocks}</div>
            <div className="text-sm text-gray-600">Avg Focus Blocks/Week</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}