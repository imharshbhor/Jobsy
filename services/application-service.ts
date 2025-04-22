import { supabase } from "@/lib/supabase"
import { Application } from "@/types/application"

const TABLE_NAME = "applications"

export async function createApplication(application: Omit<Application, "id">) {
  const { data, error } = await supabase.from(TABLE_NAME).insert([application])
  if (error) throw new Error(error.message)
  return data?.[0]
}

export async function getApplications(userId: string): Promise<Application[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

export async function getApplicationById(id: string): Promise<Application | null> {
  const { data, error } = await supabase.from(TABLE_NAME).select("*").eq("id", id).single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateApplication(id: string, updates: Partial<Application>) {
  const { data, error } = await supabase.from(TABLE_NAME).update(updates).eq("id", id).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteApplication(id: string) {
  const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id)
  if (error) throw new Error(error.message)
  return true
}
