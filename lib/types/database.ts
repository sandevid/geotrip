export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      wisata: {
        Row: {
          alamat: string
          created_at: string
          deskripsi: string
          duv_value: number | null
          ev_value: number | null
          facebook: string | null
          harga_tiket: string | null
          hpm_max: number | null
          hpm_min: number | null
          id: string
          instagram: string | null
          jam_buka: string | null
          latitude: number
          longitude: number
          nama: string
          tev_value: number | null
          tiktok: string | null
          twitter: string | null
          updated_at: string
        }
        Insert: {
          alamat: string
          created_at?: string
          deskripsi: string
          duv_value?: number | null
          ev_value?: number | null
          facebook?: string | null
          harga_tiket?: string | null
          hpm_max?: number | null
          hpm_min?: number | null
          id?: string
          instagram?: string | null
          jam_buka?: string | null
          latitude: number
          longitude: number
          nama: string
          tev_value?: number | null
          tiktok?: string | null
          twitter?: string | null
          updated_at?: string
        }
        Update: {
          alamat?: string
          created_at?: string
          deskripsi?: string
          duv_value?: number | null
          ev_value?: number | null
          facebook?: string | null
          harga_tiket?: string | null
          hpm_max?: number | null
          hpm_min?: number | null
          id?: string
          instagram?: string | null
          jam_buka?: string | null
          latitude?: number
          longitude?: number
          nama?: string
          tev_value?: number | null
          tiktok?: string | null
          twitter?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      // ... other tables remain the same
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T] extends {
  Insert: infer I
}
  ? I
  : never

export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T] extends {
  Update: infer U
}
  ? U
  : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
