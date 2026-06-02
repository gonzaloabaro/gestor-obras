import type { Metadata } from 'next'
import './globals.css'
import { NavigationProgress } from '@/components/layout/NavigationProgress'

export const metadata: Metadata = {
  title: 'ArquiFlow | Gestión de Obras',
  description: 'Plataforma de gestión de obras para arquitectos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="grain">
        <NavigationProgress />
        {children}
      </body>
    </html>
  )
}
