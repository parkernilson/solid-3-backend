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
        ]
      }
      goals: {
        Row: {
          created_at: string
          id: string
          owner: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          owner: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          owner?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_goals: {
        Row: {
          created_at: string
          goal: string
          id: number
          shared_with: string | null
          status: Database["public"]["Enums"]["shared_goal_status"]
        }
        Insert: {
          created_at?: string
          goal: string
          id?: number
          shared_with?: string | null
          status?: Database["public"]["Enums"]["shared_goal_status"]
        }
        Update: {
          created_at?: string
          goal?: string
          id?: number
          shared_with?: string | null
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
            foreignKeyName: "shared_goals_shared_with_fkey"
            columns: ["shared_with"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_shared_goal: {
        Args: {
          _goal_id: string
        }
        Returns: undefined
      }
      create_entry: {
        Args: {
          _goal_id: string
          _success: boolean
          _text_content?: string
        }
        Returns: undefined
      }
      create_goal: {
        Args: {
          _title: string
        }
        Returns: {
          created_at: string
          id: string
          owner: string
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
      share_goal: {
        Args: {
          _goal_id: string
          _with_user: string
        }
        Returns: undefined
      }
    }
    Enums: {
      shared_goal_status: "pending" | "accepted" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
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

