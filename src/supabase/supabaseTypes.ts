export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      customization_options: {
        Row: {
          category: Database["public"]["Enums"]["avatar_customization_categories"];
          id: number;
          option_value: string;
          price: number;
        };
        Insert: {
          category: Database["public"]["Enums"]["avatar_customization_categories"];
          id?: number;
          option_value: string;
          price: number;
        };
        Update: {
          category?: Database["public"]["Enums"]["avatar_customization_categories"];
          id?: number;
          option_value?: string;
          price?: number;
        };
        Relationships: [];
      };
      journal_entries: {
        Row: {
          content: string;
          entry_date: string;
          id: number;
          user_id: string;
        };
        Insert: {
          content?: string;
          entry_date: string;
          id?: number;
          user_id: string;
        };
        Update: {
          content?: string;
          entry_date?: string;
          id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "journal_entries_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      meters: {
        Row: {
          energy: number;
          happiness: number;
          health: number;
          id: number;
          self_actualization: number;
          social_connection: number;
          user_id: string;
        };
        Insert: {
          energy?: number;
          happiness?: number;
          health: number;
          id?: number;
          self_actualization?: number;
          social_connection?: number;
          user_id: string;
        };
        Update: {
          energy?: number;
          happiness?: number;
          health?: number;
          id?: number;
          self_actualization?: number;
          social_connection?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "meters_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks: {
        Row: {
          category: Database["public"]["Enums"]["category"];
          complexity: number;
          created_at: string;
          due_date: string;
          id: number;
          is_completed: boolean;
          name: string;
          priority: number;
          user_id: string;
        };
        Insert: {
          category: Database["public"]["Enums"]["category"];
          complexity: number;
          created_at?: string;
          due_date: string;
          id?: number;
          is_completed?: boolean;
          name: string;
          priority: number;
          user_id?: string;
        };
        Update: {
          category?: Database["public"]["Enums"]["category"];
          complexity?: number;
          created_at?: string;
          due_date?: string;
          id?: number;
          is_completed?: boolean;
          name?: string;
          priority?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      user_customization_ownership: {
        Row: {
          customization_id: number;
          is_active: boolean;
          user_id: string;
        };
        Insert: {
          customization_id: number;
          is_active?: boolean;
          user_id: string;
        };
        Update: {
          customization_id?: number;
          is_active?: boolean;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_customization";
            columns: ["customization_id"];
            isOneToOne: false;
            referencedRelation: "customization_options";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_user";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          avatar_name: string;
          coin_balance: number;
          full_name: string;
          id: string;
        };
        Insert: {
          avatar_name: string;
          coin_balance?: number;
          full_name: string;
          id: string;
        };
        Update: {
          avatar_name?: string;
          coin_balance?: number;
          full_name?: string;
          id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      avatar_customization_categories:
        | "accessories"
        | "accessoriesColor"
        | "backgroundColor"
        | "backgroundType"
        | "clothesColor"
        | "clothing"
        | "clothingGraphic"
        | "eyebrows"
        | "eyes"
        | "facialHair"
        | "facialHairColor"
        | "hairColor"
        | "hatColor"
        | "mouth"
        | "nose"
        | "skinColor"
        | "top";
      category:
        | "health"
        | "self_actualization"
        | "happiness"
        | "social_connection";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

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
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
