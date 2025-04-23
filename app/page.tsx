"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export default function HomePage() {
  const router = useRouter()

  const supabase = createServerSupabaseClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        router.replace("/dashboard")
      } else {
        router.replace("/login")
      }
    }

    checkAuth()
  }, [router])

  return null
}
