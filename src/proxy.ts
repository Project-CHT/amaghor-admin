import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const user = session?.user;

  // If not authenticated, redirect to login
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Only allow access if user is authenticated and has admin role
  if (user?.role !== "ADMIN" && user?.email !== process.env.ADMIN_EMAIL) {
    // For admin portal, if they are not admin, they shouldn't be here
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};