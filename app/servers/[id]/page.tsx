'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getServerById, mockServers, Server } from '@/lib/mock-data'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, AlertCircle, Clock, Zap } from 'lucide-react'
import Link from 'next/link'

export default function ServerDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [server, setServer] = useState<Server | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const id = params.id as string
    const foundServer = getServerById(id)
    setServer(foundServer || null)
    setIsLoading(false)
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen dark bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!server) {
    return (
      <div className="min-h-screen dark bg-background">
        <header className="border-b border-border bg-card/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-accent hover:underline">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">Server Not Found</h1>
            <p className="text-muted-foreground mb-6">The server you&apos;re looking for does not exist.</p>
            <Button asChild>
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  // Mock history data
  const history = Array.from({ length: 24 }, (_, i) => ({
    hour: `${(i).toString().padStart(2, '0')}:00`,
    uptime: Math.floor(Math.random() * 5) + 95,
    responseTime: Math.floor(Math.random() * 100) + 20,
  }))

  // Mock events
  const events = [
    { time: '2 hours ago', type: 'recovery', message: 'Server recovered from brief outage' },
    { time: '4 hours ago', type: 'issue', message: 'High response time detected (234ms)' },
    { time: '1 day ago', type: 'maintenance', message: 'Scheduled maintenance completed' },
    { time: '2 days ago', type: 'recovery', message: 'Network connectivity restored' },
  ]

  return (
    <div className="min-h-screen dark bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-accent hover:underline w-fit">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{server.name}</h1>
              <p className="text-muted-foreground mt-1">{server.ip}</p>
            </div>
            <StatusBadge status={server.status} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 border-border bg-card/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="mt-2">
                  <StatusBadge status={server.status} />
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-6 border-border bg-card/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Time</p>
                <p className="text-3xl font-bold text-accent mt-2">{server.responseTime}ms</p>
              </div>
              <Zap className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
          <Card className="p-6 border-border bg-card/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="text-3xl font-bold text-green-400 mt-2">{server.uptime.toFixed(2)}%</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 border-border bg-card/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Check</p>
                <p className="text-sm text-foreground mt-2 font-medium">{server.lastCheck}</p>
              </div>
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        </div>

        {/* Details section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Server information */}
          <Card className="lg:col-span-2 p-6 border-border bg-card/50 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Server Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground">Server Name</span>
                  <span className="font-medium text-foreground">{server.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground">IP Address</span>
                  <span className="font-mono text-foreground">{server.ip}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground">Region</span>
                  <span className="font-medium text-foreground">{server.region}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Status</span>
                  <div>
                    <StatusBadge status={server.status} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Performance Metrics</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className="font-medium text-foreground">{server.responseTime}ms</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground">Uptime (30 days)</span>
                  <span className="font-medium text-green-400">{server.uptime.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Last Status Check</span>
                  <span className="font-medium text-foreground">{server.lastCheck}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent events */}
          <Card className="p-6 border-border bg-card/50 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Events</h2>
            <div className="space-y-3">
              {events.map((event, i) => (
                <div key={i} className="pb-3 border-b border-border/30 last:border-0">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">{event.time}</p>
                      <p className="text-sm text-foreground">{event.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Historical data */}
        <Card className="p-6 border-border bg-card/50">
          <h2 className="text-lg font-semibold text-foreground mb-4">24-Hour History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-2 text-left text-muted-foreground font-medium">Hour</th>
                  <th className="px-4 py-2 text-left text-muted-foreground font-medium">Uptime %</th>
                  <th className="px-4 py-2 text-left text-muted-foreground font-medium">Response Time</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-background/30 transition-colors">
                    <td className="px-4 py-2 text-foreground">{h.hour}</td>
                    <td className="px-4 py-2">
                      <span className="text-green-400">{h.uptime}%</span>
                    </td>
                    <td className="px-4 py-2 text-foreground">{h.responseTime}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  )
}
