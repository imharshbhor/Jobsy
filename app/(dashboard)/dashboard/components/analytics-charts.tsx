"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

// Example data for demonstration; replace with real analytics data as needed.
const userGrowthData = [
  { month: 'Jan', users: 24 },
  { month: 'Feb', users: 35 },
  { month: 'Mar', users: 50 },
  { month: 'Apr', users: 65 },
  { month: 'May', users: 80 },
]

const appUsageData = [
  { day: 'Mon', uses: 20 },
  { day: 'Tue', uses: 18 },
  { day: 'Wed', uses: 22 },
  { day: 'Thu', uses: 27 },
  { day: 'Fri', uses: 30 },
  { day: 'Sat', uses: 15 },
  { day: 'Sun', uses: 12 },
]

import type { Application } from "@/types/application"
import { useMemo } from "react"

interface AnalyticsChartsProps {
  applications: Application[]
}

function getMonthYear(dateStr: string) {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return "Unknown"
  return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`
}

export function AnalyticsCharts({ applications }: AnalyticsChartsProps) {
  // Applications per month
  const applicationsPerMonth = useMemo(() => {
    const map: Record<string, number> = {}
    applications.forEach(app => {
      const key = getMonthYear(app.dateApplied)
      map[key] = (map[key] || 0) + 1
    })
    // Sort by date ascending
    return Object.entries(map)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([month, count]) => ({ month, count }))
  }, [applications])

  // Offers vs Rejections per month
  const offersRejectionsPerMonth = useMemo(() => {
    const map: Record<string, { offers: number; rejections: number }> = {}
    applications.forEach(app => {
      const key = getMonthYear(app.dateApplied)
      if (!map[key]) map[key] = { offers: 0, rejections: 0 }
      if (app.status === "Got the Job!" || app.status === "Offer") map[key].offers++
      if (app.status === "Rejected" || app.status === "Rejected myself") map[key].rejections++
    })
    return Object.entries(map)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([month, { offers, rejections }]) => ({ month, offers, rejections }))
  }, [applications])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="h-[440px]">
        <CardHeader>
          <CardTitle>Applications Per Month</CardTitle>
          <CardDescription>Number of job applications submitted each month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={applicationsPerMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className="h-[440px]">
        <CardHeader>
          <CardTitle>Offers vs Rejections</CardTitle>
          <CardDescription>Offers and rejections received per month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={offersRejectionsPerMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="offers" fill="#10b981" name="Offers" />
                <Bar dataKey="rejections" fill="#ef4444" name="Rejections" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
