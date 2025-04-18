export type JobApplication = {
  id: string
  company: string
  url: string
  job_title: string
  applied_through: string
  salary_lpa: number | null
  location: string
  date_applied: string
  status: "Applied" | "Interviewing" | "Offer" | "Rejected"
  latest_reply: string | null
  interview_date: string | null
  outcome: string | null
  notes: string | null
}

export type Resume = {
  id: string
  file_name: string
  upload_date: string
}

export const jobApplications: JobApplication[] = [
  {
    id: "1",
    company: "Google",
    url: "https://careers.google.com",
    job_title: "Senior Frontend Developer",
    applied_through: "Company Website",
    salary_lpa: 24,
    location: "Mountain View, CA",
    date_applied: "2023-05-15",
    status: "Interviewing",
    latest_reply: "Scheduled technical interview",
    interview_date: "2023-05-25",
    outcome: null,
    notes: "Preparing for system design interview",
  },
  {
    id: "2",
    company: "Microsoft",
    url: "https://careers.microsoft.com",
    job_title: "Full Stack Engineer",
    applied_through: "LinkedIn",
    salary_lpa: 22,
    location: "Redmond, WA",
    date_applied: "2023-05-10",
    status: "Applied",
    latest_reply: "Application received",
    interview_date: null,
    outcome: null,
    notes: "Referred by John Doe",
  },
  {
    id: "3",
    company: "Amazon",
    url: "https://amazon.jobs",
    job_title: "Software Development Engineer II",
    applied_through: "Referral",
    salary_lpa: 26,
    location: "Seattle, WA",
    date_applied: "2023-05-05",
    status: "Rejected",
    latest_reply: "Thank you for your interest",
    interview_date: "2023-05-12",
    outcome: "Position filled",
    notes: "Will try again in 6 months",
  },
  {
    id: "4",
    company: "Meta",
    url: "https://careers.meta.com",
    job_title: "React Developer",
    applied_through: "Company Website",
    salary_lpa: 23,
    location: "Menlo Park, CA",
    date_applied: "2023-05-01",
    status: "Offer",
    latest_reply: "Offer letter sent",
    interview_date: "2023-05-10",
    outcome: "Offer accepted",
    notes: "Starting on June 15th",
  },
  {
    id: "5",
    company: "Netflix",
    url: "https://jobs.netflix.com",
    job_title: "UI Engineer",
    applied_through: "Referral",
    salary_lpa: 25,
    location: "Los Gatos, CA",
    date_applied: "2023-04-28",
    status: "Interviewing",
    latest_reply: "Scheduled final round",
    interview_date: "2023-05-20",
    outcome: null,
    notes: "Preparing presentation",
  },
  {
    id: "6",
    company: "Apple",
    url: "https://jobs.apple.com",
    job_title: "Frontend Engineer",
    applied_through: "LinkedIn",
    salary_lpa: 22,
    location: "Cupertino, CA",
    date_applied: "2023-04-25",
    status: "Applied",
    latest_reply: null,
    interview_date: null,
    outcome: null,
    notes: null,
  },
  {
    id: "7",
    company: "Airbnb",
    url: "https://careers.airbnb.com",
    job_title: "Software Engineer",
    applied_through: "Company Website",
    salary_lpa: 20,
    location: "San Francisco, CA",
    date_applied: "2023-04-20",
    status: "Rejected",
    latest_reply: "Position filled",
    interview_date: "2023-04-28",
    outcome: "Not selected",
    notes: "Good interview experience",
  },
]

export const resume: Resume = {
  id: "1",
  file_name: "resume.pdf",
  upload_date: "2023-05-01",
}

export const getApplicationStats = () => {
  const stats = {
    total: jobApplications.length,
    applied: jobApplications.filter((app) => app.status === "Applied").length,
    interviewing: jobApplications.filter((app) => app.status === "Interviewing").length,
    offer: jobApplications.filter((app) => app.status === "Offer").length,
    rejected: jobApplications.filter((app) => app.status === "Rejected").length,
  }

  return stats
}
