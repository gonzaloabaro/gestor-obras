import { Header } from '@/components/layout/Header'
import { ObraForm } from '@/components/obras/ObraForm'

export default function NuevaObraPage() {
  return (
    <div className="animate-fade-in-up max-w-2xl">
      <Header
        title="Nueva obra"
        subtitle="Completá los datos del proyecto"
      />
      <div className="bg-[#0F0F10] border border-[#1E1E20] rounded-lg p-6">
        <ObraForm />
      </div>
    </div>
  )
}
