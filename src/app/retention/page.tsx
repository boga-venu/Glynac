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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'
import { ChevronDown, Download, Filter, AlertTriangle, User } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import {
  useRetentionRate,
  useFlightRiskEmployees,
  useComplaintTrends,
  useCommunicationVolume,
  useSentimentAnalysis,
  useMeetingLoad,
  FlightRiskEmployee,
  SentimentData
} from '@/hooks/use-retention-data'

export default function RetentionPage() {
  const [dateRange, setDateRange] = useState('30') // days
  const [departmentFilter, setDepartmentFilter] = useState('all')

  // Fetch retention rate
  const { data: retentionRateData, isLoading: isLoadingRetentionRate } = useRetentionRate()

  // Fetch flight risk employees
  const { data: flightRiskEmployees, isLoading: isLoadingFlightRisk } = useFlightRiskEmployees()

  // Fetch complaint trends
  const { data: complaintData, isLoading: isLoadingComplaints } = useComplaintTrends()

  // Fetch communication volume
  const { data: communicationData, isLoading: isLoadingCommunication } = useCommunicationVolume()

  // Fetch sentiment data
  const { data: sentimentData, isLoading: isLoadingSentiment } = useSentimentAnalysis()

  // Fetch meeting load
  const { data: meetingData, isLoading: isLoadingMeetings } = useMeetingLoad()

  // Get the retention rate from API or use default
  const retentionRate = retentionRateData?.rate || 85

  // Get communication volume data
  const communicationVolumeData = communicationData?.volumeByMonth || []

  const SENTIMENT_COLORS = ['#4ade80', '#94a3b8', '#f87171']

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Employee Retention</h1>
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
        {/* Retention Indicators */}
        <Card className="md:col-span-1 lg:col-span-12">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Retention Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingRetentionRate ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading retention data...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Retention Rate: {retentionRate}%</p>
                  <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${retentionRate}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  <div className="flex-1 p-4 border rounded-lg bg-blue-50">
                    <h3 className="font-medium mb-1">Company Benchmark</h3>
                    <p className="text-2xl font-bold">{retentionRate}%</p>
                    <p className="text-sm text-gray-500">Industry average: {retentionRateData?.industryAverage || 82}%</p>
                  </div>
                  <div className="flex-1 p-4 border rounded-lg bg-amber-50">
                    <h3 className="font-medium mb-1">At Risk Employees</h3>
                    <p className="text-2xl font-bold">{flightRiskEmployees?.length || 0}</p>
                    <p className="text-sm text-gray-500">Risk score above 40%</p>
                  </div>
                  <div className="flex-1 p-4 border rounded-lg bg-green-50">
                    <h3 className="font-medium mb-1">Optimal Meeting Load</h3>
                    <p className="text-2xl font-bold">{meetingData?.optimalBalance || 68}%</p>
                    <p className="text-sm text-gray-500">Employees with balanced schedule</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Complaints Over Time */}
        <Card className="md:col-span-1 lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Complaints Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">A line graph showing an increase in complaints over a period of time.</p>
            <div className="h-64 w-full">
              {isLoadingComplaints ? (
                <div className="flex justify-center items-center h-full">
                  <p>Loading complaint data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={complaintData || []}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="period" />
                    <YAxis
                      label={{
                        value: 'Number of Complaints',
                        angle: -90,
                        position: 'insideLeft',
                        offset: 15,
                        dy: 80
                      }}
                    />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" name="Complaints" stroke="#ff5a7e" fill="#ff5a7e" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Volume of Communication */}
        <Card className="md:col-span-1 lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Volume of Communication</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingCommunication ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading communication data...</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm">Total Communications: {communicationData?.total || 150}</p>
                  <p className="text-sm">Engagement Rate: {communicationData?.engagementRate || 75}%</p>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={communicationVolumeData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="volume"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Message Count"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Flight Risk Employees */}
        <Card className="md:col-span-1 lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Flight Risk Employees</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingFlightRisk ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading flight risk data...</p>
              </div>
            ) : flightRiskEmployees && flightRiskEmployees.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Tenure</TableHead>
                    <TableHead>Risk Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flightRiskEmployees.map((employee: FlightRiskEmployee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.tenure}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-full max-w-24 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${employee.risk > 60 ? 'bg-red-500' :
                                  employee.risk > 40 ? 'bg-amber-500' : 'bg-green-500'
                                }`}
                              style={{ width: `${employee.risk}%` }}
                            />
                          </div>
                          <span className="text-sm">{employee.risk}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex justify-center items-center h-40">
                <p>No flight risk employees found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Frustrated Communication */}
        <Card className="md:col-span-1 lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Frustrated Communication</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingSentiment ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading sentiment data...</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">Sentiment analysis of communication indicating frustration or negativity.</p>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sentimentData?.distribution || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }: { name: string, value: number }) => `${name}: ${value}%`}
                      >
                        {(sentimentData?.distribution || []).map((entry: SentimentData, index: number) => (
                          <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-around mt-4">
                  <div className="text-center">
                    <div className="text-sm font-medium">Positive</div>
                    <div className="text-2xl font-bold text-green-600">
                      {sentimentData?.distribution?.[0]?.value || 55}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">Neutral</div>
                    <div className="text-2xl font-bold text-gray-600">
                      {sentimentData?.distribution?.[1]?.value || 30}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">Negative</div>
                    <div className="text-2xl font-bold text-red-600">
                      {sentimentData?.distribution?.[2]?.value || 15}%
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Meeting Load */}
        <Card className="md:col-span-1 lg:col-span-12">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Meeting Load & Focus Time</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingMeetings ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading meeting data...</p>
              </div>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={meetingData?.employeeData || []}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="employee" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="meetings" name="Meeting Hours/Week" fill="#3b82f6" barSize={20} />
                    <Bar dataKey="focusTime" name="Focus Time Blocks/Week" fill="#22c55e" barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Key Insight:</span> Employees with less than 10 focus time blocks per week are 3x more likely to report burnout and 2x more likely to seek new employment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}