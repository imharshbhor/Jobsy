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
import { signIn, signInWithGitHub, signInWithGoogle } from "@/services/user-service"
import Image from "next/image"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await signIn(email, password)
            toast({
                variant: "default",
                title: "Authentication successful",
                description: "You are now signed in.",
            })
            router.push("/dashboard")
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Authentication failed",
                description: "Failed to sign in. Please try again.",
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
                <CardHeader className="space-y-3">
                    <CardTitle className="text-3xl font-bold">Jobsy</CardTitle>
                    <CardDescription>Enter your email and password to login to your account</CardDescription>
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
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="******"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full text-white" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign in"}
                        </Button>
                        <span>or</span>
                        <Button type="button" variant="outline" onClick={handleGoogleSignIn} className="w-full bg-white text-black hover:bg-gray-100" disabled={isLoading}>
                            <><Image width={32} height={32} src="/Google.png" alt="Google Sign In" />Sign up with Google</>
                        </Button>
                        <Button type="button" variant="outline" onClick={handleGitHubSignIn} className="w-full bg-white text-black hover:bg-gray-100" disabled={isLoading}>
                            <><Image className="mr-1 ml-1" width={23} height={23} src="/Github.png" alt="Github Sign In" />Sign up with GitHub</>
                        </Button>
                        <div className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="underline">
                                Sign up
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
