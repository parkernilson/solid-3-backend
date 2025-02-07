import { createClient } from "jsr:@supabase/supabase-js";
import type { Database } from "./database.types.ts";

/**
 * See for issues or more info on generated supabase types:
 * https://supabase.com/docs/guides/api/rest/generating-types
 */

export type SupabaseClient = ReturnType<typeof createClient<Database>>;

export type SupabaseAnon = {
    supabase: SupabaseClient;
    role: "anon";
}

export type SupabaseAdmin = {
    supabase: SupabaseClient;
    role: "service_role";
}

export type SupabaseAuthenticated = {
    supabase: SupabaseClient;
    role: "authenticated";
}