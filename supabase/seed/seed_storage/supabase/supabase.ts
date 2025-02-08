import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types.ts";

/**
 * See for issues or more info on generated supabase types:
 * https://supabase.com/docs/guides/api/rest/generating-types
 */

export type SupabaseClient = ReturnType<typeof createClient<Database>>;

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase environment variables")
}

export const supabaseAdmin = createClient<Database>(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
)