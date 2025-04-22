import { getApplications } from '@/services/application-service'
import { getUser } from '@/services/user-service'

export type Resume = {
  id: string
  file_name: string
  upload_date: string
}

export const fetchApplications = async () => {
  const user = await getUser()
  const applications = await getApplications(user?.id || "")
  return applications
}

export const getApplicationStats = async () => {
  const user = await getUser()
  const applications = await getApplications(user?.id || "")
  const stats = {
    total: applications.length,
    interviewing: applications.filter((app) => app.status === "Interviewing").length,
    rejected: applications.filter((app) => app.status === "Rejected").length,
    wait_for_reply: applications.filter((app) => app.status === "Wait for reply").length,
    no_reply: applications.filter((app) => app.status === "No reply").length,
    got_the_job: applications.filter((app) => app.status === "Got the Job!").length,
    maybe_later: applications.filter((app) => app.status === "Maybe later").length,
    rejected_myself: applications.filter((app) => app.status === "Rejected myself").length,
    no_answer: applications.filter((app) => app.status === "No answer").length,
    negotiating: applications.filter((app) => app.status === "Negotiating").length,
  }

  return stats
}
