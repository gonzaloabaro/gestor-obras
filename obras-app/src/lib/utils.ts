import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ProjectStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} días`
  return formatDate(dateStr)
}

export const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  'Pendiente':   { label: 'Pendiente',   color: '#8B8B8B', bg: 'rgba(139,139,139,0.1)' },
  'En progreso': { label: 'En progreso', color: '#D4A853', bg: 'rgba(212,168,83,0.12)' },
  'Finalizada':  { label: 'Finalizada',  color: '#5FA876', bg: 'rgba(95,168,118,0.12)' },
  'Pausada':     { label: 'Pausada',     color: '#C06B4A', bg: 'rgba(192,107,74,0.12)' },
}
