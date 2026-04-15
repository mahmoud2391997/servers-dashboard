'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useAuth, User } from '@/hooks/use-auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<any>
  signup: (email: string, password: string) => Promise<any>
  socialAuth: (provider: 'google' | 'github' | 'facebook') => Promise<any>
  logout: () => Promise<any>
  checkSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
