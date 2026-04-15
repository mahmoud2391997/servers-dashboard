import { Server } from '@/lib/mock-data'

interface StatusBadgeProps {
  status: Server['status']
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    up: {
      bg: 'bg-green-900/30',
      text: 'text-green-400',
      dot: 'bg-green-500',
      label: 'Up',
    },
    down: {
      bg: 'bg-red-900/30',
      text: 'text-red-400',
      dot: 'bg-red-500',
      label: 'Down',
    },
    degraded: {
      bg: 'bg-yellow-900/30',
      text: 'text-yellow-400',
      dot: 'bg-yellow-500',
      label: 'Degraded',
    },
  }

  const config = statusConfig[status]

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.bg}`}>
      <div className={`w-2 h-2 rounded-full ${config.dot}`} />
      <span className={`text-sm font-medium ${config.text}`}>{config.label}</span>
    </div>
  )
}
