import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

// Edge-safe: uses authConfig which has no Prisma dependency
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Always pass through auth API — never intercept these
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Login page: redirect to dashboard if already logged in
  if (pathname === "/login") {
    if (session) {
      const dest =
        session.user.role === "AGENT" ? "/agent/dashboard" : "/admin/dashboard";
      return NextResponse.redirect(new URL(dest, req.url));
    }
    return NextResponse.next();
  }

  // All other routes require auth
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Admin routes: block agents
  if (pathname.startsWith("/admin") && session.user.role === "AGENT") {
    return NextResponse.redirect(new URL("/agent/dashboard", req.url));
  }

  // Agent routes: block admins
  if (pathname.startsWith("/agent") && session.user.role !== "AGENT") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|manifest.json).*)"],
};
