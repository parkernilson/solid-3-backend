export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      entries: {
        Row: {
          created_at: string
          date_of: string
          goal: string
          id: string
          success: boolean
          text_content: string | null
        }
        Insert: {
          created_at?: string
          date_of?: string
          goal: string
          id?: string
          success: boolean
          text_content?: string | null
        }
        Update: {
          created_at?: string
          date_of?: string
          goal?: string
          id?: string
          success?: boolean
          text_content?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entries_goal_fkey"
            columns: ["goal"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entries_goal_fkey"
            columns: ["goal"]
            isOneToOne: false
            referencedRelation: "shared_goal_previews"
            referencedColumns: ["goal_id"]
          },
          {
            foreignKeyName: "entries_goal_fkey"
            columns: ["goal"]
            isOneToOne: false
            referencedRelation: "shared_goals"
            referencedColumns: ["goal_id"]
          },
        ]
      }
      goals: {
        Row: {
          created_at: string
          id: string
          owner: string
          start_date: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          owner: string
          start_date?: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          owner?: string
          start_date?: string
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          email: string
          id: string
          profile_image_path: string | null
        }
        Insert: {
          email: string
          id: string
          profile_image_path?: string | null
        }
        Update: {
          email?: string
          id?: string
          profile_image_path?: string | null
        }
        Relationships: []
      }
      share_records: {
        Row: {
          created_at: string
          goal: string
          id: number
          shared_with: string
          status: Database["public"]["Enums"]["shared_goal_status"]
        }
        Insert: {
          created_at?: string
          goal: string
          id?: number
          shared_with: string
          status?: Database["public"]["Enums"]["shared_goal_status"]
        }
        Update: {
          created_at?: string
          goal?: string
          id?: number
          shared_with?: string
          status?: Database["public"]["Enums"]["shared_goal_status"]
        }
        Relationships: [
          {
            foreignKeyName: "shared_goals_goal_fkey"
            columns: ["goal"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_goals_goal_fkey"
            columns: ["goal"]
            isOneToOne: false
            referencedRelation: "shared_goal_previews"
            referencedColumns: ["goal_id"]
          },
          {
            foreignKeyName: "shared_goals_goal_fkey"
            columns: ["goal"]
            isOneToOne: false
            referencedRelation: "shared_goals"
            referencedColumns: ["goal_id"]
          },
        ]
      }
    }
    Views: {
      shared_goal_previews: {
        Row: {
          goal_id: string | null
          goal_owner_email: string | null
          goal_owner_id: string | null
          goal_owner_profile_image_path: string | null
          goal_title: string | null
          share_record_id: number | null
          share_status: Database["public"]["Enums"]["shared_goal_status"] | null
          shared_on: string | null
          shared_with: string | null
        }
        Relationships: []
      }
      shared_goals: {
        Row: {
          created_at: string | null
          goal_id: string | null
          owner: string | null
          owner_email: string | null
          owner_profile_image_path: string | null
          shared_on: string | null
          shared_with: string | null
          start_date: string | null
          title: string | null
        }
        Relationships: []
      }
      streak_summary: {
        Row: {
          end_date: string | null
          goal: string | null
          sequence_id: number | null
          start_date: string | null
          streak_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "entries_goal_fkey"
            columns: ["goal"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entries_goal_fkey"
            columns: ["goal"]
            isOneToOne: false
            referencedRelation: "shared_goal_previews"
            referencedColumns: ["goal_id"]
          },
          {
            foreignKeyName: "entries_goal_fkey"
            columns: ["goal"]
            isOneToOne: false
            referencedRelation: "shared_goals"
            referencedColumns: ["goal_id"]
          },
        ]
      }
    }
    Functions: {
      accept_shared_goal: {
        Args: {
          _goal_id: string
        }
        Returns: undefined
      }
      conditional_update_params: {
        Args: {
          set_vals: Json
          permitted_key_to_col_map: Json
        }
        Returns: string
      }
      create_entry: {
        Args: {
          _goal_id: string
          _success: boolean
          _date_of: string
          _text_content?: string
        }
        Returns: {
          created_at: string
          date_of: string
          goal: string
          id: string
          success: boolean
          text_content: string | null
        }
      }
      create_goal: {
        Args: {
          _title: string
        }
        Returns: {
          created_at: string
          id: string
          owner: string
          start_date: string
          title: string
        }
      }
      create_user: {
        Args: {
          email: string
          password: string
        }
        Returns: undefined
      }
      get_current_streak_info: {
        Args: {
          _goal_id: string
        }
        Returns: Database["public"]["CompositeTypes"]["current_streak_info"]
      }
      reject_shared_goal: {
        Args: {
          _goal_id: string
        }
        Returns: undefined
      }
      share_goal: {
        Args: {
          _goal_id: string
          _with_user: string
        }
        Returns: undefined
      }
      unshare_goal: {
        Args: {
          _goal_id: string
          _with_user: string
        }
        Returns: undefined
      }
      update_entry: {
        Args: {
          _entry_id: string
          _update_values: Json
        }
        Returns: {
          created_at: string
          date_of: string
          goal: string
          id: string
          success: boolean
          text_content: string | null
        }
      }
      update_profile: {
        Args: {
          _user_id: string
          _email?: string
          _profile_image_path?: string
        }
        Returns: {
          email: string
          id: string
          profile_image_path: string | null
        }
      }
    }
    Enums: {
      shared_goal_status: "pending" | "accepted" | "rejected"
    }
    CompositeTypes: {
      current_streak_info: {
        current_period_success: boolean | null
        start_date: string | null
        end_date: string | null
        streak_count: number | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

