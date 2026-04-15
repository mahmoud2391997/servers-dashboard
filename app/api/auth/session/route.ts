import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'No session' }, { status: 401 })
    }

    const sessionData = {
      userId: session.userId,
      email: session.email,
      provider: session.provider,
      name: session.name,
      username: session.username,
      expiresAt: session.expiresAt,
    }

    return NextResponse.json(
      {
        ...sessionData,
        session: sessionData, // Backward-compatible shape for any existing consumers.
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ error: 'Failed to check session' }, { status: 500 })
  }
}
