import { resume } from "@/lib/data"
import { ResumeUploader } from "./components/resume-uploader"
import { ResumeViewer } from "./components/resume-viewer"

export default function ResumePage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resume</h1>
        <p className="text-muted-foreground mt-1">Upload and manage your resume</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ResumeUploader currentResume={resume} />
        <ResumeViewer resume={resume} />
      </div>
    </div>
  )
}
