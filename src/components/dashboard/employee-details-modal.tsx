// src/components/dashboard/employee-details-modal.tsx
'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { AlertCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SentimentTrend {
  month: string
  positive: number
  negative: number
}

interface EmployeeDetail {
  id: string
  name: string
  meetingHours: number
  afterHoursPercentage: number
  focusBlocks: number
  calendarSummary: string
  recentAlerts: Array<{
    id: string
    type: string
    title: string
    severity: 'high' | 'medium' | 'low'
  }>
  recentFiles: Array<{
    id: string
    name: string
    type: string
    action: string
    date: string
  }>
  sentimentTrend: SentimentTrend[]
}

interface EmployeeDetailsModalProps {
  employeeId: string | null
  isOpen: boolean
  onClose: () => void
  fetchEmployeeDetails: (id: string) => Promise<EmployeeDetail>
}

export function EmployeeDetailsModal({
  employeeId,
  isOpen,
  onClose,
  fetchEmployeeDetails,
}: EmployeeDetailsModalProps) {
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (isOpen && employeeId) {
      setLoading(true)
      fetchEmployeeDetails(employeeId)
        .then(data => {
          setEmployee(data)
          setLoading(false)
        })
        .catch(error => {
          console.error('Error fetching employee details:', error)
          setLoading(false)
        })
    } else {
      setEmployee(null)
    }
  }, [isOpen, employeeId, fetchEmployeeDetails])
  
  if (!isOpen) return null
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] md:max-w-[850px] p-0 gap-0 overflow-auto max-h-[90vh]">
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            Employee Details: {employee?.name || 'Loading...'}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">Loading employee details...</div>
        ) : employee ? (
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Sentiment Trend</h3>
            <div className="h-64 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={employee.sentimentTrend}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis 
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip formatter={(value) => [`${value}%`, '']} />
                  <Line
                    type="monotone"
                    dataKey="positive"
                    stroke="#4ade80"
                    strokeWidth={2}
                    name="Positive"
                  />
                  <Line
                    type="monotone"
                    dataKey="negative"
                    stroke="#f87171"
                    strokeWidth={2}
                    name="Negative"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-medium mb-2">Workload Metrics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Meeting Hours/Week:</span> 
                    <span className="font-medium">{employee.meetingHours}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>After-Hours Work:</span> 
                    <span className="font-medium">{employee.afterHoursPercentage}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Focus Blocks/Week:</span> 
                    <span className="font-medium">{employee.focusBlocks}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Recent Alerts</h3>
                {employee.recentAlerts.length === 0 ? (
                  <p className="text-gray-500">No recent alerts</p>
                ) : (
                  <div className="space-y-2">
                    {employee.recentAlerts.map(alert => (
                      <div 
                        key={alert.id} 
                        className="flex items-center gap-2 p-2 rounded bg-red-50"
                      >
                        <span role="img" aria-label="alert icon" className="text-xl">
                          {alert.type === 'burnout' ? '🔥' : '⚠️'}
                        </span>
                        <span>{alert.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Calendar Summary</h3>
                <p className="text-gray-700">{employee.calendarSummary}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Recent File Activity</h3>
                {employee.recentFiles.length === 0 ? (
                  <p className="text-gray-500">No recent file activity</p>
                ) : (
                  <div className="space-y-2">
                    {employee.recentFiles.map(file => (
                      <div key={file.id} className="flex items-center gap-2">
                        <span role="img" aria-label="file icon" className="text-xl">
                          {file.type === 'docx' ? '📄' : file.type === 'xlsx' ? '📊' : '📝'}
                        </span>
                        <div>
                          <div>{file.name} - {file.action}</div>
                          <div className="text-sm text-gray-500">{file.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
            <p>Could not load employee details. Please try again.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
