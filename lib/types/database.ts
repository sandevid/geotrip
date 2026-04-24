export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      about_section: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_active: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      fasilitas: {
        Row: {
          created_at: string
          id: string
          kategori: string
          latitude: number
          longitude: number
          nama: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          kategori: string
          latitude: number
          longitude: number
          nama: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          kategori?: string
          latitude?: number
          longitude?: number
          nama?: string
          updated_at?: string
        }
        Relationships: []
      }
      hero_section: {
        Row: {
          created_at: string | null
          description: string
          display_order: number | null
          id: string
          images: string[]
          is_active: boolean | null
          subtitle: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          display_order?: number | null
          id?: string
          images?: string[]
          is_active?: boolean | null
          subtitle: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          display_order?: number | null
          id?: string
          images?: string[]
          is_active?: boolean | null
          subtitle?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      konten_znek: {
        Row: {
          created_at: string
          id: string
          judul: string
          konten: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          judul: string
          konten: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          judul?: string
          konten?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      ulasan: {
        Row: {
          created_at: string
          id: string
          komentar: string
          rating: number
          updated_at: string
          user_id: string
          wisata_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          komentar: string
          rating: number
          updated_at?: string
          user_id: string
          wisata_id: string
        }
        Update: {
          created_at?: string
          id?: string
          komentar?: string
          rating?: number
          updated_at?: string
          user_id?: string
          wisata_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ulasan_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ulasan_wisata_id_fkey"
            columns: ["wisata_id"]
            isOneToOne: false
            referencedRelation: "wisata"
            referencedColumns: ["id"]
          },
        ]
      }
      wisata: {
        Row: {
          alamat: string
          created_at: string
          deskripsi: string
          duv_value: number | null
          ev_value: number | null
          harga_tiket: string | null
          hpm_max: number | null
          hpm_min: number | null
          id: string
          jam_buka: string | null
          latitude: number
          longitude: number
          nama: string
          tev_value: number | null
          updated_at: string
        }
        Insert: {
          alamat: string
          created_at?: string
          deskripsi: string
          duv_value?: number | null
          ev_value?: number | null
          harga_tiket?: string | null
          hpm_max?: number | null
          hpm_min?: number | null
          id?: string
          jam_buka?: string | null
          latitude: number
          longitude: number
          nama: string
          tev_value?: number | null
          updated_at?: string
        }
        Update: {
          alamat?: string
          created_at?: string
          deskripsi?: string
          duv_value?: number | null
          ev_value?: number | null
          harga_tiket?: string | null
          hpm_max?: number | null
          hpm_min?: number | null
          id?: string
          jam_buka?: string | null
          latitude?: number
          longitude?: number
          nama?: string
          tev_value?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      wisata_galeri: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_url: string
          wisata_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          wisata_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          wisata_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wisata_galeri_wisata_id_fkey"
            columns: ["wisata_id"]
            isOneToOne: false
            referencedRelation: "wisata"
            referencedColumns: ["id"]
          },
        ]
      }
      wisata_penelitian: {
        Row: {
          created_at: string
          id: string
          jenis_penelitian: string
          konten: string
          updated_at: string
          wisata_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          jenis_penelitian: string
          konten: string
          updated_at?: string
          wisata_id: string
        }
        Update: {
          created_at?: string
          id?: string
          jenis_penelitian?: string
          konten?: string
          updated_at?: string
          wisata_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wisata_penelitian_wisata_id_fkey"
            columns: ["wisata_id"]
            isOneToOne: false
            referencedRelation: "wisata"
            referencedColumns: ["id"]
          },
        ]
      }
      wisata_penelitian_charts: {
        Row: {
          chart_embed_url: string
          chart_order: number
          created_at: string | null
          id: string
          updated_at: string | null
          variabel_type: string
          wisata_id: string
        }
        Insert: {
          chart_embed_url: string
          chart_order?: number
          created_at?: string | null
          id?: string
          updated_at?: string | null
          variabel_type: string
          wisata_id: string
        }
        Update: {
          chart_embed_url?: string
          chart_order?: number
          created_at?: string | null
          id?: string
          updated_at?: string | null
          variabel_type?: string
          wisata_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wisata_penelitian_charts_wisata_id_fkey"
            columns: ["wisata_id"]
            isOneToOne: false
            referencedRelation: "wisata"
            referencedColumns: ["id"]
          },
        ]
      }
      wisata_peta_images: {
        Row: {
          created_at: string | null
          id: string
          image_order: number
          image_url: string
          updated_at: string | null
          wisata_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_order?: number
          image_url: string
          updated_at?: string | null
          wisata_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_order?: number
          image_url?: string
          updated_at?: string | null
          wisata_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wisata_peta_images_wisata_id_fkey"
            columns: ["wisata_id"]
            isOneToOne: false
            referencedRelation: "wisata"
            referencedColumns: ["id"]
          },
        ]
      }
      znek_items: {
        Row: {
          created_at: string | null
          description: string
          display_order: number
          icon_number: number | null
          id: string
          is_active: boolean | null
          item_type: string
          section_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          display_order?: number
          icon_number?: number | null
          id?: string
          is_active?: boolean | null
          item_type: string
          section_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          display_order?: number
          icon_number?: number | null
          id?: string
          is_active?: boolean | null
          item_type?: string
          section_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "znek_items_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "znek_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      znek_sections: {
        Row: {
          content: string | null
          created_at: string | null
          display_order: number
          id: string
          is_active: boolean | null
          section_type: string
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          display_order?: number
          id?: string
          is_active?: boolean | null
          section_type: string
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          display_order?: number
          id?: string
          is_active?: boolean | null
          section_type?: string
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      list_admin_users: {
        Args: never
        Returns: {
          created_at: string
          email: string
          full_name: string
          id: string
          last_sign_in_at: string
          role: string
        }[]
      }
      set_user_as_admin: {
        Args: { user_id: string }
        Returns: {
          email: string
          full_name: string
          id: string
          message: string
          role: string
        }[]
      }
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

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
