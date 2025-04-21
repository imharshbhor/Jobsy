"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { signUp, signInWithGoogle, signInWithGitHub } from "@/services/user-service"
import Image from "next/image"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
      })
      return
    }

    setIsLoading(true)

    try {
      await signUp(email, password)
      toast({
        title: "Account created",
        description: "Your account has been created successfully. You can now log in.",
      })
      router.push("/login")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Failed to create account. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
        const user = await signInWithGoogle()
        if(user?.aud === "authenticated") {
            router.push("/dashboard")
        }
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Google sign in failed",
            description: error.message || "Failed to sign in with Google. Please try again.",
        })
    } finally {
        setIsLoading(false)
    }
}

const handleGitHubSignIn = async () => {
    setIsLoading(true)
    try {
        const user = await signInWithGitHub()
        if(user?.aud === "authenticated") {
            router.push("/dashboard")
        }
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "GitHub sign in failed",
            description: error.message || "Failed to sign in with GitHub. Please try again.",
        })
    } finally {
        setIsLoading(false)
    }
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your email and password to create your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="******"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full text-white" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
            <span>or</span>
            <Button type="button" variant="outline" onClick={handleGoogleSignIn} className="w-full bg-white text-black hover:bg-gray-100" disabled={isLoading}>
                <><Image width={32} height={32} src="/Google.png" alt="Google Sign In" />Sign up with Google</>
              </Button>
              <Button type="button" variant="outline" onClick={handleGitHubSignIn} className="w-full bg-white text-black hover:bg-gray-100" disabled={isLoading}>
                <><Image className="mr-1 ml-1" width={23} height={23} src="/Github.png" alt="Github Sign In" />Sign up with GitHub</>
              </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </div>
            <div className="flex flex-col space-y-2">

            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
