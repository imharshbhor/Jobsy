"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { UploadIcon as FileUpload, Upload } from "lucide-react"
import type { Resume } from "@/lib/data"

interface ResumeUploaderProps {
  currentResume: Resume | null
}

export function ResumeUploader({ currentResume }: ResumeUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type !== "application/pdf") {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a PDF file.",
        })
        return
      }
      setSelectedFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a PDF file to upload.",
      })
      return
    }

    setIsUploading(true)
    try {
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Resume uploaded",
        description: "Your resume has been uploaded successfully.",
      })
      setSelectedFile(null)
      // Reset the file input
      const fileInput = document.getElementById("resume-file") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload resume.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Resume</CardTitle>
        <CardDescription>Upload your resume as a PDF file</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume-file">Resume (PDF)</Label>
            <Input id="resume-file" type="file" accept="application/pdf" onChange={handleFileChange} />
          </div>

          {currentResume && (
            <div className="text-sm text-muted-foreground">
              <p>Current resume: {currentResume.file_name}</p>
              <p>Uploaded on: {new Date(currentResume.upload_date).toLocaleDateString()}</p>
            </div>
          )}

          <Button type="submit" disabled={isUploading || !selectedFile}>
            {isUploading ? (
              <>
                <FileUpload className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {currentResume ? "Replace Resume" : "Upload Resume"}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
