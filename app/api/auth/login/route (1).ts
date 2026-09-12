import { NextResponse } from "next/server"

import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  validateCredentials,
} from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { username?: unknown; password?: unknown }
    const username = typeof body.username === "string" ? body.username : ""
    const password = typeof body.password === "string" ? body.password : ""

    if (!validateCredentials(username, password)) {
      return NextResponse.json(
        { error: "Incorrect email or password." },
        { status: 401 },
      )
    }

    const response = NextResponse.json({ authenticated: true })
    response.cookies.set(SESSION_COOKIE, await createSessionToken(username), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    })

    return response
  } catch {
    return NextResponse.json(
      { error: "Sign-in is temporarily unavailable." },
      { status: 500 },
    )
  }
}
