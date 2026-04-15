export interface Server {
  id: string
  name: string
  ip: string
  status: 'up' | 'down' | 'degraded'
  responseTime: number
  uptime: number
  lastCheck: string
  region: string
}

export interface User {
  id: string
  email: string
  password: string
}

// Mock servers data
export const mockServers: Server[] = [
  {
    id: '1',
    name: 'API Server 01',
    ip: '192.168.1.100',
    status: 'up',
    responseTime: 45,
    uptime: 99.8,
    lastCheck: '2 minutes ago',
    region: 'US-East',
  },
  {
    id: '2',
    name: 'Database Server',
    ip: '192.168.1.101',
    status: 'up',
    responseTime: 32,
    uptime: 99.95,
    lastCheck: '1 minute ago',
    region: 'US-East',
  },
  {
    id: '3',
    name: 'Cache Server',
    ip: '192.168.1.102',
    status: 'degraded',
    responseTime: 234,
    uptime: 98.5,
    lastCheck: '3 minutes ago',
    region: 'US-West',
  },
  {
    id: '4',
    name: 'Load Balancer',
    ip: '192.168.1.103',
    status: 'up',
    responseTime: 12,
    uptime: 100,
    lastCheck: 'Just now',
    region: 'US-Central',
  },
  {
    id: '5',
    name: 'CDN Edge',
    ip: '192.168.1.104',
    status: 'down',
    responseTime: 0,
    uptime: 87.2,
    lastCheck: '5 minutes ago',
    region: 'EU-West',
  },
  {
    id: '6',
    name: 'Email Service',
    ip: '192.168.1.105',
    status: 'up',
    responseTime: 78,
    uptime: 99.5,
    lastCheck: '2 minutes ago',
    region: 'US-Central',
  },
  {
    id: '7',
    name: 'Analytics Server',
    ip: '192.168.1.106',
    status: 'up',
    responseTime: 156,
    uptime: 99.2,
    lastCheck: '1 minute ago',
    region: 'US-West',
  },
  {
    id: '8',
    name: 'Backup Server',
    ip: '192.168.1.107',
    status: 'up',
    responseTime: 89,
    uptime: 99.9,
    lastCheck: '4 minutes ago',
    region: 'EU-West',
  },
]

// Mock users data (stored in memory)
let users: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO6', // bcrypt hash of 'password123'
  },
]

export function getServerById(id: string): Server | undefined {
  return mockServers.find((server) => server.id === id)
}

export function getUserByEmail(email: string): User | undefined {
  return users.find((user) => user.email === email)
}

export function createUser(email: string, password: string): User {
  const newUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    password, // Will be hashed in the API route
  }
  users.push(newUser)
  return newUser
}

export function getUser(email: string): User | null {
  const user = users.find((u) => u.email === email)
  return user || null
}
