"use client"

import { useMemo, useState } from "react"
import { format } from "date-fns"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
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
import type { JobApplication } from "@/lib/data"

interface ApplicationsTableProps {
  applications: JobApplication[]
}

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  const [companyFilter, setCompanyFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"company" | "date_applied" | "salary_lpa" | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const { toast } = useToast()

  const handleDelete = (id: string) => {
    toast({
      title: "Application deleted",
      description: "The job application has been deleted successfully.",
    })
  }

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
        const aValue = a[sortBy]
        const bValue = b[sortBy]
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter by company..."
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="max-w-sm"
        />

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Status <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["Applied", "Interviewing", "Offer", "Rejected"].map((status) => (
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
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort("company")} className="p-0">
                  Company <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Applied Through</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort("date_applied")} className="p-0">
                  Date Applied <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort("salary_lpa")} className="p-0">
                  Salary (LPA) <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.company}</TableCell>
                  <TableCell title={app.job_title} className="max-w-[200px] truncate">
                    {app.job_title}
                  </TableCell>
                  <TableCell>{app.applied_through}</TableCell>
                  <TableCell>{app.location}</TableCell>
                  <TableCell>{format(new Date(app.date_applied), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(app.status)} text-white`}>
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {app.salary_lpa ? `₹${app.salary_lpa} LPA` : "-"}
                  </TableCell>
                  <TableCell>
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
                        <DropdownMenuItem>Edit Application</DropdownMenuItem>
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
                <TableCell colSpan={8} className="text-center py-10">
                  No applications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
