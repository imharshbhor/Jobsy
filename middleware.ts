import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // This is a simplified middleware that doesn't actually check authentication
  // In a real app, you would verify the session/token here

  const isLoggedIn = request.cookies.has("logged_in")
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup")

  // If user is not logged in and trying to access a protected route
  //if (!isLoggedIn && !isAuthPage) {
  //  return NextResponse.redirect(new URL("/login", request.url))
  //}

  // If user is logged in and trying to access login/signup pages
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Only run middleware on specific paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
