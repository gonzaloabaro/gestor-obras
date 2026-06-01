export type ProjectStatus = 'Pendiente' | 'En progreso' | 'Finalizada' | 'Pausada'

export type ExpenseCategory =
  | 'Materiales'
  | 'Mano de obra'
  | 'Electricidad'
  | 'Pintura'
  | 'Sanitarios'
  | 'Equipamiento'
  | 'Transporte'
  | 'Honorarios'
  | 'Otros'

export type FileType = 'foto' | 'plano' | 'contrato' | 'pdf' | 'otro'

export interface User {
  id: string
  nombre: string
  email: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  nombre: string
  cliente: string
  direccion: string | null
  fecha_inicio: string | null
  fecha_fin_estimada: string | null
  estado: ProjectStatus
  presupuesto: number
  descripcion: string | null
  created_at: string
  updated_at: string
}

export interface ProgressEntry {
  id: string
  project_id: string
  comentario: string
  fecha: string
  created_at: string
  updated_at: string
}

export interface Expense {
  id: string
  project_id: string
  categoria: ExpenseCategory
  descripcion: string | null
  monto: number
  fecha: string
  created_at: string
  updated_at: string
}

export interface ProjectFile {
  id: string
  project_id: string
  nombre: string
  url: string
  tipo: FileType
  created_at: string
  updated_at: string
}

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }
