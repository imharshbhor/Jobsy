import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import type { JobApplication } from "@/lib/data"

interface RecentApplicationsProps {
  applications: JobApplication[]
}

export function RecentApplications({ applications }: RecentApplicationsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "bg-blue-500"
      case "Interviewing":
        return "bg-purple-500"
      case "Offer":
        return "bg-green-500"
      case "Rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="h-[440px]">
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
        <CardDescription>Your most recent job applications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8 overflow-auto max-h-[400px] pr-2">
          {applications.length === 0 ? (
            <p className="text-center text-muted-foreground">No applications yet</p>
          ) : (
            applications.slice(0,5).map((application) => (
              <div key={application.id} className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{application.job_title}</p>
                  <p className="text-sm text-muted-foreground">{application.company}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Badge variant="secondary" className={`${getStatusColor(application.status)} text-white`}>
                    {application.status}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(application.date_applied), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
