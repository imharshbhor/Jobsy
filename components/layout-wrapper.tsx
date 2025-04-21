"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "./theme-provider"
import { supabase } from "@/lib/supabase"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  const publicRoutes = ["/login", "/signup"]

  useEffect(() => {
    const protectRoute = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      const isPublic = publicRoutes.includes(pathname)

      if (!session && !isPublic) {
        router.replace("/login")
      } else if (session && isPublic) {
        router.replace("/dashboard")
      } else {
        setLoading(false)
      }
    }

    protectRoute()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      protectRoute()
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [pathname, router])

  if (loading) return null

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
      <Toaster />
    </ThemeProvider>
  )
}
