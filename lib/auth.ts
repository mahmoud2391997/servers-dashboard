import { cookies } from 'next/headers'

export interface Session {
  userId: string
  email: string
  provider: string
  name?: string
  username?: string
  expiresAt: number
}

const SESSION_COOKIE_NAME = 'session'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export async function createSession(userId: string, email: string, provider: string, name?: string, username?: string): Promise<void> {
  const cookieStore = await cookies()
  const expiresAt = Date.now() + SESSION_DURATION

  const session: Session = {
    userId,
    email,
    provider,
    name,
    username,
    expiresAt,
  }

  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  })
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (!sessionCookie?.value) {
    return null
  }

  try {
    const session = JSON.parse(sessionCookie.value) as Session

    if (session.expiresAt < Date.now()) {
      // Session expired
      cookieStore.delete(SESSION_COOKIE_NAME)
      return null
    }

    return session
  } catch {
    return null
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
