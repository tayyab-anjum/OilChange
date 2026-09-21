import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // CSRF Protection: Verify Origin / Referer matches host
  const host = request.headers.get("host");
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return NextResponse.json(
          { success: false, error: "Cross-origin logout request rejected." },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid origin header." },
        { status: 403 }
      );
    }
  } else if (referer && host) {
    try {
      const refererHost = new URL(referer).host;
      if (refererHost !== host) {
        return NextResponse.json(
          { success: false, error: "Cross-origin logout request rejected." },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid referer header." },
        { status: 403 }
      );
    }
  }

  const response = NextResponse.json(
    { success: true, message: "Logged out successfully.", redirect: "/login" },
    { status: 200 }
  );

  // Clear session cookie
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
