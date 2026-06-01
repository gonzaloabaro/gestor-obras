import { STATUS_CONFIG } from '@/lib/utils'
import type { ProjectStatus } from '@/types'

interface ObraStatusBadgeProps {
  estado: ProjectStatus
  size?: 'sm' | 'md'
}

export function ObraStatusBadge({ estado, size = 'md' }: ObraStatusBadgeProps) {
  const config = STATUS_CONFIG[estado]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      <span
        className="rounded-full flex-shrink-0"
        style={{
          width: size === 'sm' ? 5 : 6,
          height: size === 'sm' ? 5 : 6,
          backgroundColor: config.color,
        }}
      />
      {config.label}
    </span>
  )
}
