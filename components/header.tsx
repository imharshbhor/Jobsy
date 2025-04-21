"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Briefcase, FileText, Menu, User, Code, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "./theme-toggle"
import { getUser, signOut } from "@/services/user-service"
import { useRouter } from "next/navigation"
import { useEffect, useState } from 'react'

export function Header() {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser()
            setUser(user)
        }
        fetchUser()
    }, [])

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
            active: pathname === "/dashboard",
        },
        {
            label: "Applications",
            icon: Briefcase,
            href: "/applications",
            active: pathname === "/applications",
        },
        // {
        //     label: "Resume",
        //     icon: FileText,
        //     href: "/resume",
        //     active: pathname === "/resume",
        // },
    ]

    const SidebarContent = (
        <div className="flex h-full flex-col space-y-4 py-4">
            <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">Jobsy</h2>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${route.active ? "bg-accent text-accent-foreground" : "transparent"
                                }`}
                        >
                            <route.icon className="mr-2 h-4 w-4" />
                            {route.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 md:px-8">
            <div className="flex items-center gap-2">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        {SidebarContent}
                    </SheetContent>
                </Sheet>
                <Link href="/dashboard" className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold tracking-tighter">Jobsy</h1>
                </Link>
            </div>
            <nav className="hidden md:flex md:gap-2">
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${route.active ? "bg-accent text-accent-foreground" : "transparent"
                            }`}
                    >
                        {route.label}
                    </Link>
                ))}
            </nav>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                {user?.user_metadata.avatar_url ? <img src={user?.user_metadata.avatar_url} alt="User Avatar" /> : <AvatarFallback>{user?.email?.split('@')[0][0].toUpperCase()}</AvatarFallback>}
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">

                        <div className="flex items-center justify-start gap-2 p-2">
                            <div className="flex flex-col leading-none">
                                <span className="text-sm">Signed in as</span>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                            </div>
                        </div>
                        <DropdownMenuSeparator />
                        {/* <DropdownMenuItem asChild>
                            <Link href="/profile" className="flex w-full items-center">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </Link>
                        </DropdownMenuItem> */}
                        <DropdownMenuItem className="flex w-full items-center cursor-pointer" onClick={() => {
                            router.push('/login');
                            signOut();
                        }}>
                            <LogOut className="mr-2 h-4 w-4" /><span>Sign out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
