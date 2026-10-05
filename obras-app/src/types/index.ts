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

// ─── Multi-tenant ───
export type PlatformRole = 'super_admin' | null
export type OrgRole = 'owner' | 'admin' | 'miembro'
export type OrgEstado = 'activo' | 'suspendido'
export type MemberEstado = 'activo' | 'inactivo'

export interface User {
  id: string
  nombre: string
  email: string
  platform_role: PlatformRole
  created_at: string
  updated_at: string
}

export interface Plan {
  id: string
  nombre: string
  max_empleados: number | null
  precio_mensual: number
  stripe_price_id: string | null
  activo: boolean
  created_at: string
}

export interface Organization {
  id: string
  nombre: string
  slug: string | null
  plan_id: string | null
  estado: OrgEstado
  stripe_customer_id: string | null
  created_at: string
  updated_at: string
}

export interface OrganizationMember {
  id: string
  org_id: string
  user_id: string
  rol: OrgRole
  estado: MemberEstado
  created_at: string
  updated_at: string
}

// Resumen para el listado del panel Super Admin
export interface EstudioResumen {
  id: string
  nombre: string
  estado: OrgEstado
  created_at: string
  plan: { nombre: string; max_empleados: number | null } | null
  miembros: number
}

export interface Project {
  id: string
  org_id: string
  user_id: string | null   // creado_por
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

// ─── Contexto del estudio del usuario actual (CP5) ───
export interface EstudioContext {
  orgId: string
  orgNombre: string
  rol: OrgRole
  planNombre: string | null
  maxEmpleados: number | null   // null = ilimitado
  empleadosActivos: number      // rol in (admin,miembro), estado activo
}

export interface MiembroRow {
  id: string
  userId: string
  nombre: string
  email: string
  rol: OrgRole
  estado: MemberEstado
  created_at: string
}
