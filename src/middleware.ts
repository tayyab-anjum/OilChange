import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect both /dashboard UI pages and /api/dashboard administrative APIs
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isDashboardApi = pathname.startsWith("/api/dashboard");

  if (isDashboardPage || isDashboardApi) {
    const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;
    const isValid = sessionCookie ? await verifySessionToken(sessionCookie) : false;

    if (!isValid) {
      if (isDashboardApi) {
        return NextResponse.json(
          { success: false, error: "Unauthorized: Valid operator session required." },
          { status: 401 }
        );
      }

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/dashboard/:path*"],
};
