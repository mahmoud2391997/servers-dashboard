import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE_NAME = 'session'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

// Mock Google OAuth flow - in production, you'd use actual OAuth with Google
export async function POST(request: NextRequest) {
  try {
    // In a real implementation, you would:
    // 1. Verify the Google OAuth token
    // 2. Extract user information from Google
    // 3. Create or find user in your database
    // 4. Create session
    
    // For demo purposes, we'll simulate a successful Google login
    const mockGoogleUser = {
      id: 'google_' + Math.random().toString(36).substr(2, 9),
      email: 'user@gmail.com',
      name: 'Google User'
    }

    const expiresAt = Date.now() + SESSION_DURATION
    const session = {
      userId: mockGoogleUser.id,
      email: mockGoogleUser.email,
      provider: 'google',
      name: mockGoogleUser.name,
      expiresAt,
    }

    const response = NextResponse.json({ 
      success: true,
      user: {
        id: mockGoogleUser.id,
        email: mockGoogleUser.email,
        name: mockGoogleUser.name,
        provider: 'google'
      }
    })

    // Set the session cookie in the response
    response.cookies.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION / 1000,
      path: '/',
    })

    response.headers.append('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    return response
  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.json({ error: 'Google authentication failed' }, { status: 500 })
  }
}
