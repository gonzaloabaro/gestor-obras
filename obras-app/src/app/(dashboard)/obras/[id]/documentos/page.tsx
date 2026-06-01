import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getObra } from '@/actions/obras.actions'
import { getFiles } from '@/actions/files.actions'
import { Header } from '@/components/layout/Header'
import { FileUploader } from '@/components/documentos/FileUploader'
import { FileList } from '@/components/documentos/FileList'
import { ArrowLeft } from 'lucide-react'

export default async function DocumentosPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const obra = await getObra(id)
  if (!obra) notFound()

  const files = await getFiles(id)

  const porTipo = files.reduce((acc, f) => {
    acc[f.tipo] = (acc[f.tipo] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="animate-fade-in-up max-w-3xl">
      <Link
        href={`/obras/${id}`}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={13} />
        Volver a {obra.nombre}
      </Link>

      <Header
        title="Documentos"
        subtitle={`${files.length} archivo${files.length !== 1 ? 's' : ''} subido${files.length !== 1 ? 's' : ''}`}
        actions={<FileUploader projectId={id} />}
      />

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { tipo: 'plano',    label: 'Planos',    color: '#7B8FD4' },
            { tipo: 'contrato', label: 'Contratos', color: '#D4A853' },
            { tipo: 'pdf',      label: 'PDFs',      color: '#D47B7B' },
            { tipo: 'otro',     label: 'Otros',     color: '#8B8B8B' },
          ].map(({ tipo, label, color }) => (
            <div
              key={tipo}
              className="bg-[#0F0F10] border border-[#1E1E20] rounded-lg p-4"
            >
              <p className="text-xs text-muted-foreground mb-2">{label}</p>
              <p className="font-display text-2xl" style={{ color }}>
                {porTipo[tipo] ?? 0}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-[#0F0F10] border border-[#1E1E20] rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1E1E20]">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Archivos
          </p>
        </div>
        <FileList files={files} projectId={id} />
      </div>
    </div>
  )
}
