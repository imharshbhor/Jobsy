"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import type { Resume } from "@/lib/data"

interface ResumeViewerProps {
  resume: Resume | null
}

export function ResumeViewer({ resume }: ResumeViewerProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Resume Preview</CardTitle>
        <CardDescription>View your uploaded resume</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {resume ? (
          <div className="flex h-[500px] flex-col items-center justify-center rounded-md border p-8 text-center">
            <FileText className="h-10 w-10 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">Resume Available</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {resume.file_name} (Uploaded on {new Date(resume.upload_date).toLocaleDateString()})
            </p>
            <p className="mt-4 text-sm">PDF preview is disabled in this demo version.</p>
          </div>
        ) : (
          <div className="flex h-[500px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No resume uploaded</h3>
            <p className="mt-2 text-sm text-muted-foreground">Upload a resume to see a preview here</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
