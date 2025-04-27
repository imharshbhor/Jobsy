"use client"

import { fetchApplications } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Import, PlusCircle } from "lucide-react"
import { ApplicationsTable } from "./components/applications-table"
import { useState, useEffect } from "react"
import AddApplicationDialog from "./components/add-application-dialog copy"
import ImportDataDialog from "./components/import-data-dialog"
import { Application } from "@/types/application"

export default function ApplicationsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [applications, setApplications] = useState([])

  useEffect(() => {
    fetchAppData()
  }, [])

  const fetchAppData = async () => {
    const data: Application[] = await fetchApplications()
    setApplications(data)
  }

  return (
      <div className="flex flex-col gap-4 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground mt-1">Manage and track your job applications</p>
        </div>
        <div>
        <Button className="text-white" onClick={() => setIsAddOpen(true)}>
          <PlusCircle className="h-4 w-4" />
          Add Application
        </Button>
        <Button variant="outline" className="text-background bg-foreground ml-4" onClick={() => setIsImportOpen(true)}>
          <Import className="h-4 w-4" />
          Import Data
        </Button>
        </div>
      </div>

      <ApplicationsTable applications={applications} onClose={() => { fetchAppData(); }}  />
      <AddApplicationDialog isAddOpen={isAddOpen} onClose={() => { setIsAddOpen(false); fetchAppData(); }} />
      <ImportDataDialog isImportOpen={isImportOpen} onClose={() => { setIsImportOpen(false); fetchAppData(); }} />
    </div>
  )
}
