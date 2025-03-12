'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'

interface Employee {
  id: string
  name: string
  status: 'at_risk' | 'warning' | 'good'
  sentiment: 'positive' | 'neutral' | 'negative'
  workload: 'overloaded' | 'balanced' | 'underloaded'
  riskLevel: 'high' | 'medium' | 'low'
}

interface EmployeeInsightsProps {
  employees: Employee[]
  onSelectEmployee: (employeeId: string) => void
}

export function EmployeeInsights({ employees, onSelectEmployee }: EmployeeInsightsProps) {
  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'at_risk':
        return <span className="h-2.5 w-2.5 rounded-full bg-red-500 inline-block mr-2" />
      case 'warning':
        return <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block mr-2" />
      case 'good':
        return <span className="h-2.5 w-2.5 rounded-full bg-green-500 inline-block mr-2" />
      default:
        return null
    }
  }
  
  const getSentimentTag = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <span className="inline-block rounded bg-green-50 px-2 py-1 text-xs font-medium text-green-600">Positive</span>
      case 'neutral':
        return <span className="inline-block rounded bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600">Neutral</span>
      case 'negative':
        return <span className="inline-block rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-600">Negative</span>
      default:
        return null
    }
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Employee Insights</CardTitle>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            Department <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sentiment</TableHead>
              <TableHead>Workload</TableHead>
              <TableHead>Risk Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow 
                key={employee.id} 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onSelectEmployee(employee.id)}
              >
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>
                  {getStatusIndicator(employee.status)}
                  {employee.status === 'at_risk' && 'At Risk'}
                  {employee.status === 'warning' && 'Warning'}
                  {employee.status === 'good' && 'Good'}
                </TableCell>
                <TableCell>{getSentimentTag(employee.sentiment)}</TableCell>
                <TableCell>
                  {employee.workload === 'overloaded' && 'Overloaded'}
                  {employee.workload === 'balanced' && 'Balanced'}
                  {employee.workload === 'underloaded' && 'Underloaded'}
                </TableCell>
                <TableCell>
                  {employee.riskLevel === 'high' && <span className="font-medium text-red-600">High</span>}
                  {employee.riskLevel === 'medium' && <span className="font-medium text-amber-600">Medium</span>}
                  {employee.riskLevel === 'low' && <span className="font-medium text-green-600">Low</span>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}