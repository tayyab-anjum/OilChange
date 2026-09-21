import { NextRequest, NextResponse } from "next/server";
import {
  validateOperatorCredentials,
  createSessionToken,
  COOKIE_NAME,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Please provide both email and password." },
        { status: 400 }
      );
    }

    const isValid = validateOperatorCredentials(email, password);
    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid operator email or password. Please verify credentials.",
        },
        { status: 401 }
      );
    }

    // Generate secure session token
    const token = await createSessionToken(email);

    const response = NextResponse.json(
      {
        success: true,
        message: "Operator authenticated successfully.",
        redirect: "/dashboard",
      },
      { status: 200 }
    );

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days session
    });

    return response;
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}
