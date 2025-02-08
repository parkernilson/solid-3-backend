import { Database } from "../../supabase/database.types.ts";

export type SupabaseProfile = Database["public"]["Tables"]["profiles"]["Row"];