// Tipos generados del schema de Supabase
// Regenerar con: npx supabase gen types typescript --project-id TU_PROJECT_ID > lib/supabase/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          nombre: string | null
          rol: 'admin' | 'colaborador'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          nombre?: string | null
          rol?: 'admin' | 'colaborador'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nombre?: string | null
          rol?: 'admin' | 'colaborador'
          updated_at?: string
        }
      }
      clientes: {
        Row: {
          id: string
          codigo: string
          nombre: string
          apellido: string
          email: string | null
          telefono: string | null
          provincia: string | null
          canal_ingreso: string
          estado: string
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['clientes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['clientes']['Insert']>
      }
      visas: {
        Row: {
          id: string
          codigo: string
          cliente_id: string
          tipo_visa: string
          estado: string
          ds160: string | null
          fecha_turno: string | null
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['visas']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['visas']['Insert']>
      }
      pagos: {
        Row: {
          id: string
          codigo: string
          cliente_id: string
          visa_id: string | null
          monto: number
          estado: string
          concepto: string | null
          fecha_pago: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['pagos']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['pagos']['Insert']>
      }
      historial: {
        Row: {
          id: string
          cliente_id: string
          visa_id: string | null
          tipo: string
          descripcion: string
          metadata: Json | null
          origen: 'dashboard' | 'telegram' | 'sistema'
          usuario_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['historial']['Row'], 'id' | 'created_at'>
        Update: never
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
