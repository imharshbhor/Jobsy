"use client"

import { useMemo, useState } from "react"
import { format } from "date-fns"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import type { Application } from "@/types/application"
import EditApplicationDialog from "./edit-application-dialog"
import { deleteApplication } from "@/services/application-service"

interface ApplicationsTableProps {
  applications: Application[]
  onClose: () => void
}

export function ApplicationsTable({ applications, onClose }: ApplicationsTableProps) {
  const [companyFilter, setcompanyFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"company" | "dateApplied" | "salary" | null>(null)
  const [sortAsc, setSortAsc] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 4

  const handleDelete = async (id: string) => {
    try {
      await deleteApplication(id)

      toast({
        title: "Application deleted",
        description: "The job application has been deleted successfully.",
        variant: "default",
      })

      onClose();
    } catch (error) {
      console.error("Failed to delete application:", error)
      toast({
        title: "Error",
        description: "Failed to delete the application.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Wait for reply":
        return "bg-yellow-500"
      case "No reply":
        return "bg-gray-500"
      case "Interviewing":
        return "bg-purple-500"
      case "Got the Job!":
        return "bg-green-500"
      case "Maybe later":
        return "bg-blue-500"
      case "Rejected":
        return "bg-red-500"
      case "Rejected myself":
        return "bg-red-500"
      case "No answer":
        return "bg-gray-500"
      case "Negotiating":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getLocationTypeColor = (locationType: string) => {
    switch (locationType) {
      case "Remote":
        return "bg-blue-500"
      case "On-site":
        return "bg-green-500"
      case "Hybrid":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const filtered = useMemo(() => {
    let data = [...applications]

    if (companyFilter) {
      data = data.filter((a) =>
        a.company.toLowerCase().includes(companyFilter.toLowerCase())
      )
    }

    if (statusFilter.length > 0) {
      data = data.filter((a) => statusFilter.includes(a.status))
    }

    if (sortBy) {
      data.sort((a, b) => {
        const aValue = a[sortBy] || ""
        const bValue = b[sortBy] || ""
        if (aValue < bValue) return sortAsc ? -1 : 1
        if (aValue > bValue) return sortAsc ? 1 : -1
        return 0
      })
    }

    return data
  }, [applications, companyFilter, statusFilter, sortBy, sortAsc])

  const toggleSort = (key: typeof sortBy) => {
    if (sortBy === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortBy(key)
      setSortAsc(true)
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const currentItems = filtered.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter by company..."
          value={companyFilter}
          onChange={(e) => setcompanyFilter(e.target.value)}
          className="max-w-sm"
        />

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Status <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              {["Wait for reply", "Interviewing", "Offer", "Rejected"].map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={statusFilter.includes(status)}
                  onCheckedChange={(checked) => {
                    setStatusFilter((prev) =>
                      checked
                        ? [...prev, status]
                        : prev.filter((s) => s !== status)
                    )
                  }}
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Details</TableHead>
              <TableHead>Requirements</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="w-32 text-center">Salary (LPA)</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="w-32">Date Applied</TableHead>
              <TableHead className="w-32 pl-10">Status</TableHead>
              <TableHead>Latest Reply</TableHead>
              <TableHead className="w-36">Interview Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium flex flex-col gap-2"><a className="text-lg" href={app.url} target="_blank">{app.company}</a><span>{app.jobTitle}</span></TableCell>
                  <TableCell>{app.requirements}</TableCell>
                  <TableCell>{app.appliedThrough}</TableCell>
                  <TableCell className="text-center">{app.salary}</TableCell>
                  <TableCell>{app.location}</TableCell>
                  <TableCell>
                    <Badge className={`${getLocationTypeColor(app.locationType)} text-background`}>
                      {app.locationType}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(app.dateApplied), "MMM d, yyyy")}</TableCell>
                  <TableCell align="center">
                    {app.status ?
                    <Badge className={`${getStatusColor(app.status)} text-background text-center`}>
                      {app.status}
                    </Badge> : ""}
                  </TableCell>
                  <TableCell>{app.latestReply}</TableCell>
                  <TableCell>{app.interviewDate ? format(new Date(app.interviewDate), "MMM d, yyyy") : ""}</TableCell>
                  <TableCell align="center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => window.open(app.url, "_blank")}>
                          View Job Posting
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => { setSelectedId(app.id); setIsEditOpen(true); }}>
                          Edit Application
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(app.id)}
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} className="text-center text-muted-foreground py-10">
                  No applications yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isEditOpen && <EditApplicationDialog selectedId={selectedId} isEditOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setSelectedId(null); onClose(); }} />}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm pl-2">Page {currentPage + 1}</span>
        <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
          Prev
        </Button>
        <Button variant="outline" onClick={() => handlePageChange(currentPage + 1)} disabled={currentItems.length < itemsPerPage}>
          Next
        </Button>
        </div>
      </div>
    </div>
  )
}
