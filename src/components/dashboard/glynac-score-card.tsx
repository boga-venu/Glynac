// src/components/dashboard/glynac-score-card.tsx
import { Card } from "@/components/ui/card"
import { formatNumber } from "@/lib/utils"

interface GlynacScoreCardProps {
  overallScore: number
  communicationScore: number
  workloadScore: number
  wellbeingScore: number
  trend: number
}

export function GlynacScoreCard({
  overallScore,
  communicationScore,
  workloadScore,
  wellbeingScore,
  trend,
}: GlynacScoreCardProps) {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 text-center text-white">
      <div className="p-6">
        <h3 className="text-xl font-medium">Glynac Score</h3>
        <div className="my-4 text-7xl font-bold">{Math.round(overallScore)}</div>
        <div className="mb-4 text-sm">
          {trend > 0 ? '+' : ''}{formatNumber(trend)} points from last month
        </div>
        
        <div className="flex justify-around">
          <div className="text-center">
            <div className="text-2xl font-semibold">{Math.round(communicationScore)}</div>
            <div className="text-xs opacity-90">Communication</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-semibold">{Math.round(workloadScore)}</div>
            <div className="text-xs opacity-90">Workload</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-semibold">{Math.round(wellbeingScore)}</div>
            <div className="text-xs opacity-90">Wellbeing</div>
          </div>
        </div>
      </div>
    </Card>
  )
}