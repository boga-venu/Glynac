// src/components/dashboard/risk-alerts.tsx
'use client'

import { useState } from 'react'
import { AlertTriangle, AlertCircle, Calendar, Filter, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'

interface RiskAlert {
  id: string
  title: string
  description: string
  type: 'harassment' | 'burnout' | 'security' | 'complaint' | 'calendar'
  severity: 'high' | 'medium' | 'low'
  time: string
}

interface RiskAlertsProps {
  alerts: RiskAlert[]
  onViewDetails: (alertId: string) => void
}

export function RiskAlerts({ alerts, onViewDetails }: RiskAlertsProps) {
  const [filter] = useState('all')
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'harassment':
        return <AlertTriangle className="h-6 w-6" />
      case 'burnout':
        return <AlertCircle className="h-6 w-6" />
      case 'calendar':
        return <Calendar className="h-6 w-6" />
      default:
        return <AlertTriangle className="h-6 w-6" />
    }
  }
  
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 text-red-600'
      case 'medium':
        return 'bg-amber-50 text-amber-600'
      case 'low':
        return 'bg-slate-50 text-slate-600'
      default:
        return 'bg-slate-50 text-slate-600'
    }
  }
  
  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.severity === filter)
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Risk Alerts</CardTitle>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {filteredAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`flex items-start gap-3 p-3 rounded-md border-l-4 ${
                alert.severity === 'high' 
                  ? 'border-red-500' 
                  : alert.severity === 'medium' 
                    ? 'border-amber-500' 
                    : 'border-slate-400'
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                alert.severity === 'high' 
                  ? 'bg-red-50 text-red-500' 
                  : alert.severity === 'medium' 
                    ? 'bg-amber-50 text-amber-500' 
                    : 'bg-slate-100 text-slate-500'
              }`}>
                {getIcon(alert.type)}
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium">{alert.title}</h4>
                <p className="text-sm text-gray-600">{alert.description}</p>
                {alert.type === 'harassment' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2 h-8 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                    onClick={() => onViewDetails(alert.id)}
                  >
                    View Details
                  </Button>
                )}
              </div>
              
              <div className="flex flex-col items-end min-w-[100px]">
                <div className="text-sm text-gray-500">{alert.time}</div>
                <div className={`mt-1 rounded-full px-2 py-1 text-xs font-medium ${getSeverityClass(alert.severity)}`}>
                  {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)} Risk
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
