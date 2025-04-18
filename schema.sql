-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  url TEXT NOT NULL,
  job_title TEXT NOT NULL,
  applied_through TEXT NOT NULL,
  salary_lpa NUMERIC,
  location TEXT NOT NULL,
  date_applied DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Applied', 'Interviewing', 'Offer', 'Rejected')),
  latest_reply TEXT,
  interview_date DATE,
  outcome TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Enable Row Level Security
  CONSTRAINT job_applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Enable Row Level Security
  CONSTRAINT resumes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Create policies for job_applications
CREATE POLICY "Users can view their own job applications"
  ON job_applications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own job applications"
  ON job_applications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job applications"
  ON job_applications
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own job applications"
  ON job_applications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for resumes
CREATE POLICY "Users can view their own resumes"
  ON resumes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resumes"
  ON resumes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes"
  ON resumes
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes"
  ON resumes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', TRUE);

-- Set up storage policies
CREATE POLICY "Public can read resume files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'resumes');

CREATE POLICY "Users can upload resume files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'resumes' AND auth.uid() = owner);

CREATE POLICY "Users can update their own resume files"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'resumes' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own resume files"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'resumes' AND auth.uid() = owner);
