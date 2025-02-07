import type { SupabaseAuthenticated, SupabaseClient } from "../supabase/supabase.ts";

export class ProfileService {
    private supabase: SupabaseClient;

    constructor({ supabase }: SupabaseAuthenticated) {
        this.supabase = supabase;
    }
}