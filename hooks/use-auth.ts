'use client'

import { useEffect, useState } from 'react'

export interface User {
  id: string
  email: string
  name?: string
  username?: string
  provider: string
}

export interface Session {
  userId: string
  email: string
  provider: string
  name?: string
  username?: string
  expiresAt: number
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session', { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        const session = data?.session ?? data

        if (!session?.userId || !session?.email) {
          setUser(null)
          setIsAuthenticated(false)
          return
        }

        setUser({
          id: session.userId,
          email: session.email,
          provider: session.provider || 'email',
          name: session.name,
          username: session.username,
        })
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Session check failed:', error)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Login failed')
    }

    await checkSession()
    return response.json()
  }

  const signup = async (email: string, password: string) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Signup failed')
    }

    await checkSession()
    return response.json()
  }

  const socialAuth = async (provider: 'google' | 'github' | 'facebook') => {
    const response = await fetch(`/api/auth/${provider}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || `${provider} auth failed`)
    }

    await checkSession()
    return response.json()
  }

  const logout = async () => {
    const response = await fetch('/api/auth/logout', { method: 'POST' })
    
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Logout failed')
    }

    setUser(null)
    setIsAuthenticated(false)
    return response.json()
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    socialAuth,
    logout,
    checkSession,
  }
}
