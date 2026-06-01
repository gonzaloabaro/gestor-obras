import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ArquiFlow | Gestión de Proyectos',
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
        {children}
      </body>
    </html>
  )
}
