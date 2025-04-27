"use client"

import { useEffect, useState } from 'react'
import { getApplicationStats, fetchApplications } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, CheckCircle, XCircle, Users } from "lucide-react"
import { RecentApplications } from "./components/recent-applications"
import { ApplicationsChart } from "./components/applications-chart"
import { AnalyticsCharts } from "./components/analytics-charts"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Application } from '@/types/application'

export default function DashboardPage() {
  const [stats, setStats] = useState({})
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      const fetchedStats = await getApplicationStats()
      const fetchedApplications = await fetchApplications()
      setStats(fetchedStats)
      setApplications(fetchedApplications)
    }

    fetchDashboardData()
  }, [])

  if (!stats || !applications) {
    return <div className='flex justify-center items-center h-[80vh]'>Loading...</div>
  }

  const recentApplications = applications.slice(0, 5)

  return (
      <div className="flex flex-col gap-4 p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground mt-[-14px]">Analytics and insights.</p>
      <Tabs defaultValue="overview" className="w-full mt-2">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-[#3b82f6]/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card className="bg-[#8b5cf6]/20">
              <CardHeader className="flex flex-row items-center justify-between space-y -0 pb-2">
                <CardTitle className="text-sm font-medium">Interviewing</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.interviewing}</div>
              </CardContent>
            </Card>
            <Card className="bg-[#10b981]/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Offers</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.got_the_job}</div>
              </CardContent>
            </Card>
            <Card className="bg-[#ef4444]/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejections</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.rejected}</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <ApplicationsChart stats={stats} />
            <RecentApplications applications={recentApplications} />
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <AnalyticsCharts applications={applications} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
