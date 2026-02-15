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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      agent_runs: {
        Row: {
          created_at: string
          errors_json: Json | null
          finished_at: string | null
          grants_found: number | null
          id: string
          organization_id: string
          raw_response_json: Json | null
          run_type: string
          sources_count: number | null
          started_at: string
          status: string
        }
        Insert: {
          created_at?: string
          errors_json?: Json | null
          finished_at?: string | null
          grants_found?: number | null
          id?: string
          organization_id: string
          raw_response_json?: Json | null
          run_type?: string
          sources_count?: number | null
          started_at?: string
          status?: string
        }
        Update: {
          created_at?: string
          errors_json?: Json | null
          finished_at?: string | null
          grants_found?: number | null
          id?: string
          organization_id?: string
          raw_response_json?: Json | null
          run_type?: string
          sources_count?: number | null
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_runs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      grant_sources: {
        Row: {
          category: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          organization_id: string
          updated_at: string
          url: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          updated_at?: string
          url: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "grant_sources_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      grants: {
        Row: {
          application_url: string | null
          award_announcement_date: string | null
          created_at: string
          date_confidence: string | null
          deadline_date: string | null
          deadline_raw_text: string | null
          deadline_time: string | null
          documents: string | null
          eligible_applicants: string[] | null
          external_id: string | null
          focus_areas: string[] | null
          funder_name: string | null
          funding_amount_json: Json | null
          funding_type: string | null
          geographic_eligibility: string | null
          grant_title: string
          id: string
          info_session_dates: string[] | null
          is_stale: boolean | null
          last_seen_at: string | null
          last_verified_date: string | null
          needs_review: boolean | null
          number_of_awards: number | null
          open_date: string | null
          organization_id: string
          program_name: string | null
          project_end_date: string | null
          project_start_date: string | null
          requirements: string | null
          rolling_deadline: boolean | null
          source_domain: string | null
          source_url: string | null
          status: string | null
          summary: string | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          application_url?: string | null
          award_announcement_date?: string | null
          created_at?: string
          date_confidence?: string | null
          deadline_date?: string | null
          deadline_raw_text?: string | null
          deadline_time?: string | null
          documents?: string | null
          eligible_applicants?: string[] | null
          external_id?: string | null
          focus_areas?: string[] | null
          funder_name?: string | null
          funding_amount_json?: Json | null
          funding_type?: string | null
          geographic_eligibility?: string | null
          grant_title: string
          id?: string
          info_session_dates?: string[] | null
          is_stale?: boolean | null
          last_seen_at?: string | null
          last_verified_date?: string | null
          needs_review?: boolean | null
          number_of_awards?: number | null
          open_date?: string | null
          organization_id: string
          program_name?: string | null
          project_end_date?: string | null
          project_start_date?: string | null
          requirements?: string | null
          rolling_deadline?: boolean | null
          source_domain?: string | null
          source_url?: string | null
          status?: string | null
          summary?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          application_url?: string | null
          award_announcement_date?: string | null
          created_at?: string
          date_confidence?: string | null
          deadline_date?: string | null
          deadline_raw_text?: string | null
          deadline_time?: string | null
          documents?: string | null
          eligible_applicants?: string[] | null
          external_id?: string | null
          focus_areas?: string[] | null
          funder_name?: string | null
          funding_amount_json?: Json | null
          funding_type?: string | null
          geographic_eligibility?: string | null
          grant_title?: string
          id?: string
          info_session_dates?: string[] | null
          is_stale?: boolean | null
          last_seen_at?: string | null
          last_verified_date?: string | null
          needs_review?: boolean | null
          number_of_awards?: number | null
          open_date?: string | null
          organization_id?: string
          program_name?: string | null
          project_end_date?: string | null
          project_start_date?: string | null
          requirements?: string | null
          rolling_deadline?: boolean | null
          source_domain?: string | null
          source_url?: string | null
          status?: string | null
          summary?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "grants_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          created_at: string
          daily_digest: boolean | null
          email_enabled: boolean | null
          id: string
          organization_id: string
          remind_days_before: number[] | null
          updated_at: string
          weekly_digest: boolean | null
        }
        Insert: {
          created_at?: string
          daily_digest?: boolean | null
          email_enabled?: boolean | null
          id?: string
          organization_id: string
          remind_days_before?: number[] | null
          updated_at?: string
          weekly_digest?: boolean | null
        }
        Update: {
          created_at?: string
          daily_digest?: boolean | null
          email_enabled?: boolean | null
          id?: string
          organization_id?: string
          remind_days_before?: number[] | null
          updated_at?: string
          weekly_digest?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          annual_budget_range: string | null
          created_at: string
          focus_areas: string[] | null
          id: string
          keywords: string[] | null
          location_city: string | null
          location_country: string | null
          location_state: string | null
          mission: string | null
          name: string
          org_type: string | null
          owner_user_id: string
          updated_at: string
        }
        Insert: {
          annual_budget_range?: string | null
          created_at?: string
          focus_areas?: string[] | null
          id?: string
          keywords?: string[] | null
          location_city?: string | null
          location_country?: string | null
          location_state?: string | null
          mission?: string | null
          name: string
          org_type?: string | null
          owner_user_id: string
          updated_at?: string
        }
        Update: {
          annual_budget_range?: string | null
          created_at?: string
          focus_areas?: string[] | null
          id?: string
          keywords?: string[] | null
          location_city?: string | null
          location_country?: string | null
          location_state?: string | null
          mission?: string | null
          name?: string
          org_type?: string | null
          owner_user_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          timezone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_grants: {
        Row: {
          created_at: string
          grant_id: string
          id: string
          notes: string | null
          organization_id: string
          pipeline_status: string
          priority_score: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          grant_id: string
          id?: string
          notes?: string | null
          organization_id: string
          pipeline_status?: string
          priority_score?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          grant_id?: string
          id?: string
          notes?: string | null
          organization_id?: string
          pipeline_status?: string
          priority_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_grants_grant_id_fkey"
            columns: ["grant_id"]
            isOneToOne: false
            referencedRelation: "grants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_grants_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to_user_id: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          organization_id: string
          saved_grant_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to_user_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          organization_id: string
          saved_grant_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to_user_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          organization_id?: string
          saved_grant_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_saved_grant_id_fkey"
            columns: ["saved_grant_id"]
            isOneToOne: false
            referencedRelation: "saved_grants"
            referencedColumns: ["id"]
          },
        ]
      }
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
