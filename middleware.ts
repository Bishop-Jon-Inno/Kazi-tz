import { auth } from "./lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isLoginPage = req.nextUrl.pathname === "/admin/login"
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin")

  if (isAdminPage && !isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }
})

export const config = {
  matcher: ["/admin/:path*"]
}