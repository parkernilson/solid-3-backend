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
      delete_entry: {
        Args: {
          _entry_id: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      shared_goal_status: ["pending", "accepted", "rejected"],
    },
  },
} as const

