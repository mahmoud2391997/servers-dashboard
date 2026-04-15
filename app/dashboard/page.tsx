'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { mockServers, Server } from '@/lib/mock-data'
import { ServerTable } from '@/components/server-table'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { LogOut, RefreshCw } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [servers, setServers] = useState<Server[]>(mockServers)
  const [filteredServers, setFilteredServers] = useState<Server[]>(mockServers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'up' | 'down' | 'degraded'>('all')
  const [sortBy, setSortBy] = useState('name')
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session')
        if (!response.ok) {
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [router])

  // Apply filters and sorting
  useEffect(() => {
    let filtered = servers.filter((server) => {
      const matchesSearch =
        server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        server.ip.includes(searchTerm)
      const matchesStatus = statusFilter === 'all' || server.status === statusFilter
      return matchesSearch && matchesStatus
    })

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'ip':
          return a.ip.localeCompare(b.ip)
        case 'status':
          return a.status.localeCompare(b.status)
        case 'responseTime':
          return a.responseTime - b.responseTime
        case 'uptime':
          return b.uptime - a.uptime
        case 'region':
          return a.region.localeCompare(b.region)
        default:
          return 0
      }
    })

    setFilteredServers(sorted)
  }, [servers, searchTerm, statusFilter, sortBy])

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    // In a real app, this would fetch fresh data from the server
    setServers([...mockServers])
  }

  const statusCounts = {
    up: servers.filter((s) => s.status === 'up').length,
    down: servers.filter((s) => s.status === 'down').length,
    degraded: servers.filter((s) => s.status === 'degraded').length,
  }

  return (
    <div className="min-h-screen dark bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Server Monitor</h1>
            <p className="text-sm text-muted-foreground">Real-time server status overview</p>
          </div>
          <Button
            onClick={handleLogout}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            {isLoading ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {isChecking && (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        )}
        {!isChecking && (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6 border-border bg-card/50">
                <div className="text-sm text-muted-foreground">Total Servers</div>
                <div className="text-3xl font-bold text-foreground mt-2">{servers.length}</div>
              </Card>
              <Card className="p-6 border-border bg-card/50 border-l-4 border-l-green-500">
                <div className="text-sm text-muted-foreground">Operational</div>
                <div className="text-3xl font-bold text-green-400 mt-2">{statusCounts.up}</div>
              </Card>
              <Card className="p-6 border-border bg-card/50 border-l-4 border-l-yellow-500">
                <div className="text-sm text-muted-foreground">Degraded</div>
                <div className="text-3xl font-bold text-yellow-400 mt-2">{statusCounts.degraded}</div>
              </Card>
              <Card className="p-6 border-border bg-card/50 border-l-4 border-l-red-500">
                <div className="text-sm text-muted-foreground">Down</div>
                <div className="text-3xl font-bold text-red-400 mt-2">{statusCounts.down}</div>
              </Card>
            </div>

        {/* Filters and search */}
            <Card className="p-6 border-border bg-card/50 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by server name or IP..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-background border-border"
              />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="all">All Status</option>
                  <option value="up">Up</option>
                  <option value="degraded">Degraded</option>
                  <option value="down">Down</option>
                </select>
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  className="gap-2 shrink-0"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Showing {filteredServers.length} of {servers.length} servers
              </div>
            </Card>

            {/* Servers table */}
            <Card className="border-border bg-card/50 overflow-hidden">
              {filteredServers.length > 0 ? (
                <ServerTable servers={filteredServers} sortBy={sortBy} onSort={setSortBy} />
              ) : (
                <div className="p-12 text-center">
                  <p className="text-muted-foreground">No servers found matching your criteria.</p>
                </div>
              )}
            </Card>
          </>
        )}
      </main>
    </div>
  )
}
