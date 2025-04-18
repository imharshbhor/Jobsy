import { jobApplications } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { ApplicationsTable } from "./components/applications-table"

export default function ApplicationsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground mt-1">Manage and track your job applications</p>
        </div>
        <Button className="text-white">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Application
        </Button>
      </div>

      <ApplicationsTable applications={jobApplications} />
    </div>
  )
}
