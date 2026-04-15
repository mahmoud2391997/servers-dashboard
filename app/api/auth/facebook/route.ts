import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE_NAME = 'session'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

// Mock Facebook OAuth flow - in production, you'd use actual OAuth with Facebook
export async function POST(request: NextRequest) {
  try {
    // In a real implementation, you would:
    // 1. Verify the Facebook OAuth token
    // 2. Extract user information from Facebook
    // 3. Create or find user in your database
    // 4. Create session
    
    // For demo purposes, we'll simulate a successful Facebook login
    const mockFacebookUser = {
      id: 'facebook_' + Math.random().toString(36).substr(2, 9),
      email: 'user@facebook.com',
      name: 'Facebook User',
      username: 'facebookuser'
    }

    const expiresAt = Date.now() + SESSION_DURATION
    const session = {
      userId: mockFacebookUser.id,
      email: mockFacebookUser.email,
      provider: 'facebook',
      name: mockFacebookUser.name,
      username: mockFacebookUser.username,
      expiresAt,
    }

    const response = NextResponse.json({ 
      success: true,
      user: {
        id: mockFacebookUser.id,
        email: mockFacebookUser.email,
        name: mockFacebookUser.name,
        username: mockFacebookUser.username,
        provider: 'facebook'
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
    console.error('Facebook auth error:', error)
    return NextResponse.json({ error: 'Facebook authentication failed' }, { status: 500 })
  }
}
