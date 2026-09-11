const SESSION_COOKIE = "yoyo_session"
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12

const allowedUsers = [
  "peter.lamke@worldline.com",
  "kalin.yanev@worknomads.com",
] as const

type AllowedUser = (typeof allowedUsers)[number]

const encoder = new TextEncoder()

function normalizeUsername(username: string) {
  return username.trim().toLowerCase()
}

function getPassword(username: string) {
  if (username === "peter.lamke@worldline.com") {
    return process.env.PETER_PASSWORD
  }

  if (username === "kalin.yanev@worknomads.com") {
    return process.env.KALIN_PASSWORD
  }

  return undefined
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false

  let mismatch = 0
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }

  return mismatch === 0
}

function isAllowedUser(username: string): username is AllowedUser {
  return allowedUsers.includes(username as AllowedUser)
}

async function sign(payload: string) {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error("AUTH_SECRET is not configured")

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload))

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

export { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS }

export function validateCredentials(username: string, password: string) {
  const normalizedUsername = normalizeUsername(username)
  const expectedPassword = getPassword(normalizedUsername)

  return Boolean(
    isAllowedUser(normalizedUsername) &&
      expectedPassword &&
      constantTimeEqual(password, expectedPassword),
  )
}

export async function createSessionToken(username: string) {
  const normalizedUsername = normalizeUsername(username)
  if (!isAllowedUser(normalizedUsername)) throw new Error("Unknown user")

  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000
  const payload = `${encodeURIComponent(normalizedUsername)}:${expiresAt}`
  return `${payload}.${await sign(payload)}`
}

export async function verifySessionToken(token?: string) {
  if (!token) return null

  const separator = token.lastIndexOf(".")
  if (separator < 1) return null

  const payload = token.slice(0, separator)
  const suppliedSignature = token.slice(separator + 1)
  const separatorInPayload = payload.lastIndexOf(":")
  if (separatorInPayload < 1) return null

  const username = normalizeUsername(
    decodeURIComponent(payload.slice(0, separatorInPayload)),
  )
  const expiresAt = Number(payload.slice(separatorInPayload + 1))

  if (!isAllowedUser(username) || !Number.isFinite(expiresAt) || Date.now() > expiresAt) {
    return null
  }

  const expectedSignature = await sign(payload)
  return constantTimeEqual(suppliedSignature, expectedSignature) ? username : null
}
