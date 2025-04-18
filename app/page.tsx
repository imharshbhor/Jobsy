"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
//   const { user } = useUserStore()

  useEffect(() => {
    // if (user) {
    //   router.push("/dashboard")
    // } else {
    //   router.push("/login")
    // }
    router.push("/login")
  }, [router])

  return null; // Return null while redirecting
}
