// src/components/dashboard/sentiment-analysis.tsx
'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SentimentData {
  month: string
  positive: number
  neutral: number
  negative: number
}

interface SentimentAnalysisProps {
  data: SentimentData[]
  positivePercentage: number
  neutralPercentage: number
  negativePercentage: number
}

export function SentimentAnalysis({
  data,
  positivePercentage,
  neutralPercentage,
  negativePercentage,
}: SentimentAnalysisProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Communication Sentiment</CardTitle>
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
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, '']}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="positive"
                stackId="1"
                stroke="#2ecc71"
                fill="rgba(46, 204, 113, 0.2)"
                name="Positive"
              />
              <Area
                type="monotone"
                dataKey="neutral"
                stackId="1"
                stroke="#95a5a6"
                fill="rgba(149, 165, 166, 0.2)"
                name="Neutral"
              />
              <Area
                type="monotone"
                dataKey="negative"
                stackId="1"
                stroke="#e74c3c"
                fill="rgba(231, 76, 60, 0.2)"
                name="Negative"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="rounded-md bg-blue-50 p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{positivePercentage}%</div>
            <div className="text-sm text-gray-600">Positive Tone</div>
          </div>
          <div className="rounded-md bg-gray-50 p-3 text-center">
            <div className="text-2xl font-bold text-gray-600">{neutralPercentage}%</div>
            <div className="text-sm text-gray-600">Neutral Tone</div>
          </div>
          <div className="rounded-md bg-red-50 p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{negativePercentage}%</div>
            <div className="text-sm text-gray-600">Negative Tone</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
