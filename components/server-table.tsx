'use client'

import { Server } from '@/lib/mock-data'
import { StatusBadge } from './status-badge'
import Link from 'next/link'
import { ArrowUpDown } from 'lucide-react'

interface ServerTableProps {
  servers: Server[]
  sortBy: string
  onSort: (column: string) => void
}

export function ServerTable({ servers, sortBy, onSort }: ServerTableProps) {
  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null
    return <ArrowUpDown className="w-4 h-4" />
  }

  const columns = [
    { key: 'name', label: 'Server Name' },
    { key: 'ip', label: 'IP Address' },
    { key: 'status', label: 'Status' },
    { key: 'responseTime', label: 'Response Time' },
    { key: 'uptime', label: 'Uptime' },
    { key: 'region', label: 'Region' },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-3 text-left">
                <button
                  onClick={() => onSort(col.key)}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-accent transition-colors"
                >
                  {col.label}
                  {getSortIcon(col.key)}
                </button>
              </th>
            ))}
            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {servers.map((server) => (
            <tr key={server.id} className="border-b border-border/50 hover:bg-card/50 transition-colors">
              <td className="px-6 py-4">
                <span className="font-medium text-foreground">{server.name}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-muted-foreground text-sm font-mono">{server.ip}</span>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={server.status} />
              </td>
              <td className="px-6 py-4">
                <span className="text-muted-foreground text-sm">{server.responseTime}ms</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-muted-foreground text-sm">{server.uptime.toFixed(2)}%</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-muted-foreground text-sm">{server.region}</span>
              </td>
              <td className="px-6 py-4">
                <Link
                  href={`/servers/${server.id}`}
                  className="text-accent hover:underline text-sm font-medium"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
