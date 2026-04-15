import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE_NAME = 'session'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

// Mock GitHub OAuth flow - in production, you'd use actual OAuth with GitHub
export async function POST(request: NextRequest) {
  try {
    // In a real implementation, you would:
    // 1. Verify the GitHub OAuth token
    // 2. Extract user information from GitHub
    // 3. Create or find user in your database
    // 4. Create session
    
    // For demo purposes, we'll simulate a successful GitHub login
    const mockGitHubUser = {
      id: 'github_' + Math.random().toString(36).substr(2, 9),
      email: 'user@github.com',
      name: 'GitHub User',
      username: 'githubuser'
    }

    const expiresAt = Date.now() + SESSION_DURATION
    const session = {
      userId: mockGitHubUser.id,
      email: mockGitHubUser.email,
      provider: 'github',
      name: mockGitHubUser.name,
      username: mockGitHubUser.username,
      expiresAt,
    }

    const response = NextResponse.json({ 
      success: true,
      user: {
        id: mockGitHubUser.id,
        email: mockGitHubUser.email,
        name: mockGitHubUser.name,
        username: mockGitHubUser.username,
        provider: 'github'
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
    console.error('GitHub auth error:', error)
    return NextResponse.json({ error: 'GitHub authentication failed' }, { status: 500 })
  }
}
