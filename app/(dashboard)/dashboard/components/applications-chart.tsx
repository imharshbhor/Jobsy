"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tooltip as RechartsTooltip, Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { useState } from "react"

interface ApplicationsChartProps {
  stats: {
    total: number
    wait_for_reply: number
    interviewing: number
    got_the_job: number
    rejected: number
  }
}

export function ApplicationsChart({ stats }: ApplicationsChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const data = [
    { name: "Waiting for reply", value: stats.wait_for_reply, color: "#f3a261" },
    { name: "Interviewing", value: stats.interviewing, color: "#8b5cf6" },
    { name: "Offer", value: stats.got_the_job, color: "#10b981" },
    { name: "Rejected", value: stats.rejected, color: "#ef4444" },
  ].filter((item) => item.value > 0)

  const onPieEnter = (_: any, index: number) => setActiveIndex(index)
  const onPieLeave = () => setActiveIndex(null)

  return (
    <Card className="h-[440px]">
      <CardHeader>
        <CardTitle>Application Status</CardTitle>
        <CardDescription>
          Distribution of your job applications by status
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px]">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="45%"
                  outerRadius={90}
                  innerRadius={50}
                  dataKey="value"
                  nameKey="name"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value: any, name: any) => [`${value}`, `${name}`]}
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "6px", border: "1px solid #e5e7eb" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="flex items-center justify-center h-[300px] text-muted-foreground">No applications yet.</p>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
