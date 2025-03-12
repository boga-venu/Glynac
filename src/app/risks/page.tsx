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
import { ChevronDown, Download, Filter, AlertTriangle, AlertCircle, User } from 'lucide-react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useRiskAlerts } from '@/hooks/use-dashboard-data'
import { 
  useSecurityRisks, 
  useHarassmentMessages, 
  useComplaintTrends, 
  useUnwantedBehaviors,
  useRiskDistribution
} from '@/hooks/use-risk-data'

export default function RisksPage() {
  const [filter, setFilter] = useState('all')
  const [dateRange, setDateRange] = useState('30') // days
  const [activeTab, setActiveTab] = useState('all')
  
  // Fetch risk alerts data
  const { data: alertsData, isLoading: isLoadingAlerts } = useRiskAlerts()
  
  // Fetch security risks
  const { data: securityRisksData, isLoading: isLoadingSecurityRisks } = useSecurityRisks()
  
  // Fetch harassment messages
  const { data: harassmentData, isLoading: isLoadingHarassment } = useHarassmentMessages()
  
  // Fetch complaint trends
  const { data: complaintData, isLoading: isLoadingComplaints } = useComplaintTrends()
  
  // Fetch unwanted behavior
  const { data: unwantedBehaviorData, isLoading: isLoadingBehavior } = useUnwantedBehaviors()
  
  // Fetch risk distribution
  const { data: riskDistributionData, isLoading: isLoadingDistribution } = useRiskDistribution()
  
  const COLORS = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#FF0000']
  
  // Format functions for tables and cards
  const getRiskLevelBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">High</span>
      case 'medium':
        return <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">Medium</span>
      case 'low':
        return <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">Low</span>
      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Risk Management & Employee Behavior</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
        {/* Security Risks Table */}
        <Card className="md:col-span-1 lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Security Risks</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingSecurityRisks ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading security risks...</p>
              </div>
            ) : securityRisksData && securityRisksData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Risk Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityRisksData.map((risk, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{risk.employeeName}</TableCell>
                      <TableCell>{getRiskLevelBadge(risk.riskLevel)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex justify-center items-center h-40">
                <p>No security risks found</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Abusive Language & Harassment */}
        <Card className="md:col-span-1 lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Abusive Language & Harassment</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingHarassment ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading harassment data...</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {harassmentData && harassmentData.length > 0 ? (
                  harassmentData.slice(0, 2).map((message, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Message from {message.sender}:</p>
                        <p className="text-gray-600">"{message.content}"</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-600">No flagged messages found</p>
                    </div>
                  </li>
                )}
                <li className="flex items-start gap-2 mt-4">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-600 font-medium">View all flagged messages</p>
                  </div>
                </li>
              </ul>
            )}
          </CardContent>
        </Card>
        
        {/* Disputes & Complaints */}
        <Card className="md:col-span-1 lg:col-span-12">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Disputes & Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">A line chart showing an increase in complaints over a period of time.</p>
            <div className="h-64 w-full">
              {isLoadingComplaints ? (
                <div className="flex justify-center items-center h-full">
                  <p>Loading complaint data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
  data={complaintData || []}
  margin={{ top: 10, right: 30, left: 15, bottom: 0 }} // Slight increase to left margin
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
        
        {/* Unwanted Behavior */}
        <Card className="md:col-span-1 lg:col-span-12">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Unwanted Behavior</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingBehavior ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading behavior data...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {unwantedBehaviorData ? unwantedBehaviorData.map((behavior, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-1">{behavior.type}</h3>
                    <p className="text-2xl font-bold">{behavior.count} occurrences</p>
                  </div>
                )) : (
                  <div className="border rounded-lg p-4 col-span-2">
                    <h3 className="font-medium mb-1">No unwanted behavior data</h3>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Risk Distribution Pie Chart */}
        <Card className="md:col-span-1 lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Risk Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              {isLoadingDistribution ? (
                <div className="flex justify-center items-center h-full">
                  <p>Loading risk distribution...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDistributionData || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {(riskDistributionData || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Harassment Trends Line Chart */}
        <Card className="md:col-span-1 lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Harassment Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              {isLoadingHarassment ? (
                <div className="flex justify-center items-center h-full">
                  <p>Loading harassment data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={harassmentData ? [{month: 'Jan', count: 2}, {month: 'Feb', count: 1}] : []}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" name="Incidents" stroke="#ff5a7e" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}