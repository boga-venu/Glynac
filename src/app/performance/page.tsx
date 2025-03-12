'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  LabelList,
  Cell
} from 'recharts'
import {  Download } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import {
  usePerformanceDrags,
  useEfficiencyScore,
  useUntappedTalent,
  useResponseTimes,
  useNegativeCommunication,
  useOverdueTasks,
  useRepeatedTopics
} from '@/hooks/use-performance-data'

export default function PerformancePage() {
  const [departmentFilter, setDepartmentFilter] = useState('all')

  // Fetch performance drags data
  const { data: performanceDragsData, isLoading: isLoadingDrags } = usePerformanceDrags()

  // Fetch efficiency score
  const { data: efficiencyData, isLoading: isLoadingEfficiency } = useEfficiencyScore()

  // Fetch untapped talent
  const { data: untappedTalentData, isLoading: isLoadingTalent } = useUntappedTalent()

  // Fetch response times
  const { data: responseTimeData, isLoading: isLoadingResponseTimes } = useResponseTimes()

  // Fetch negative communication
  const { data: negativeCommunicationData, isLoading: isLoadingNegative } = useNegativeCommunication()

  // Fetch overdue tasks
  const { data: overdueTasksData, isLoading: isLoadingTasks } = useOverdueTasks()

  // Fetch repeated topics
  const { data: repeatedTopicsData, isLoading: isLoadingTopics } = useRepeatedTopics()

  
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Performance Drags</h1>
        <div className="flex gap-2">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
        {/* Performance Drags Scatter Chart */}
        <Card className="md:col-span-1 lg:col-span-12">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Performance Drags</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">A bubble chart highlighting employees who display performance drags.</p>
            <div className="h-96 w-full">
              {isLoadingDrags ? (
                <div className="flex justify-center items-center h-full">
                  <p>Loading performance data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 40, left: 25 }} // Increased bottom margin
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      dataKey="responseTime"
                      name="Response Time"
                      unit="h"
                      label={{
                        value: "Response Time (hours)",
                        position: "bottom",
                        offset: 15 
                      }}
                      tickLine={true}
                      axisLine={true}
                    />
                    <YAxis
                      type="number"
                      dataKey="negativity"
                      name="Negativity Score"
                      unit="%"
                      label={{ value: "Negativity Score (%)", angle: -90, position: "left",
                        
                        dy: -20  }}
                      tickLine={true}
                      axisLine={true}
                    />
                    <ZAxis type="number" range={[100, 100]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />

                    <Scatter
                      name="Employees"
                      data={performanceDragsData || []}
                      fill="#8884d8"
                    >
                      {(performanceDragsData || []).map((entry, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.negativity > 60 || entry.responseTime > 5 ? '#e11d48' :
                            entry.negativity > 40 || entry.responseTime > 3 ? '#f59e0b' :
                              '#10b981'}
                        />
                      ))}
                      <LabelList
                        dataKey="employee"
                        position="top"
                        offset={10}
                        style={{
                          fontSize: '10px',
                          fontWeight: '400',
                          fill: '#4b5563'
                        }}
                      />
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Efficiency Score */}
        <Card className="md:col-span-1 lg:col-span-12">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Efficiency Score</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingEfficiency ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading efficiency data...</p>
              </div>
            ) : efficiencyData ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border bg-blue-50">
                  <h3 className="text-sm font-medium mb-1">Task Completion Rate</h3>
                  <p className="text-2xl font-bold">
                    {efficiencyData.taskCompletionRate}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Company avg: 80%</p>
                </div>
                <div className="p-4 rounded-lg border bg-orange-50">
                  <h3 className="text-sm font-medium mb-1">Average Response Time</h3>
                  <p className="text-2xl font-bold">
                    {efficiencyData.avgResponseTime} hours
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Company avg: 2.5 hours</p>
                </div>
                <div className="p-4 rounded-lg border bg-purple-50">
                  <h3 className="text-sm font-medium mb-1">Meeting Overload</h3>
                  <p className="text-2xl font-bold">
                    {efficiencyData.meetingOverload} meetings
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Above optimal per day</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-40">
                <p>No efficiency data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Untapped Talent */}
        <Card className="md:col-span-1 lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Untapped Talent</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingTalent ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading talent data...</p>
              </div>
            ) : untappedTalentData && untappedTalentData.length > 0 ? (
              <>
                <p className="text-sm text-gray-500 mb-4">A bar chart showing employees with untapped potential.</p>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={untappedTalentData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="employee" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="skillScore" name="Skill Score" fill="#a78bfa" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <ul className="mt-4 space-y-1">
                  {untappedTalentData.map((employee, index: number) => (
                    <li key={index} className="text-sm">
                      <span className="font-medium">{employee.employee}</span> - Skill Score: {employee.skillScore}, Complaints: {employee.complaints}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="flex justify-center items-center h-40">
                <p>No untapped talent data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Slow Response Time */}
        <Card className="md:col-span-1 lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Slow Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingResponseTimes ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading response time data...</p>
              </div>
            ) : responseTimeData && responseTimeData.length > 0 ? (
              <>
                <p className="text-sm text-gray-500 mb-4">Employees with higher than benchmark response times.</p>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={responseTimeData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="employee" />
                      <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avgResponse" name="Avg Response Time (hours)" fill="#ec4899">
                        {responseTimeData.map((entry, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.avgResponse > entry.benchmark ? '#e11d48' : '#10b981'}
                          />
                        ))}
                      </Bar>
                      <Bar dataKey="benchmark" name="Benchmark" fill="#94a3b8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center h-40">
                <p>No response time data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Negative Communication */}
        <Card className="md:col-span-1 lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Negative Language</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingNegative ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading communication data...</p>
              </div>
            ) : negativeCommunicationData && negativeCommunicationData.length > 0 ? (
              <>
                <p className="text-sm text-gray-500 mb-4">Percentage of negative language in communications.</p>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={negativeCommunicationData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="employee" />
                      <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft',
                        offset: 15,
                        dy: 80 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="negativePercentage" name="Negative Language %" fill="#f43f5e">
                        {negativeCommunicationData.map((entry, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.negativePercentage > 20 ? '#e11d48' :
                              entry.negativePercentage > 10 ? '#f59e0b' : '#10b981'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center h-40">
                <p>No negative communication data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overdue Tasks */}
        <Card className="md:col-span-1 lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Overdue Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingTasks ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading task data...</p>
              </div>
            ) : overdueTasksData && overdueTasksData.length > 0 ? (
              <>
                <p className="text-sm text-gray-500 mb-4">Number of overdue tasks per employee.</p>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={overdueTasksData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="employee" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Overdue Tasks" fill="#f97316">
                        {overdueTasksData.map((entry, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.count > 3 ? '#e11d48' :
                              entry.count > 1 ? '#f59e0b' : '#10b981'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center h-40">
                <p>No overdue tasks data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Repeated Topics */}
        <Card className="md:col-span-1 lg:col-span-12">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Repeated Topics</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingTopics ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading topics data...</p>
              </div>
            ) : repeatedTopicsData && repeatedTopicsData.length > 0 ? (
              <>
                <p className="text-sm text-gray-500 mb-4">Topics that are frequently repeated in communications, potentially indicating unresolved issues.</p>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={repeatedTopicsData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="topic" />
                      <YAxis label={{ value: 'Occurrences', angle: -90, position: 'insideLeft',
                        offset: 15,
                        dy: 80 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Occurrences" fill="#06b6d4" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Key Insight:</span> Frequently repeated topics often indicate unresolved issues or communication bottlenecks. Consider addressing these topics in dedicated meetings.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center h-40">
                <p>No repeated topics data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
