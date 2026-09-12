import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const username = await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value)

    if (!username) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ authenticated: true, username })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
