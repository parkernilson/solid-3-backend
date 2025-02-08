import { SupabaseAuthenticated, SupabaseClient } from "../supabase/supabase.ts";

export class UserService {
    private supabase: SupabaseClient;

    constructor({ supabase }: SupabaseAuthenticated, private req: Request) {
        this.supabase = supabase;
    }

    private extractToken(req: Request) {
        return req.headers.get("Authorization")?.replace("Bearer ", "");
    }

    async getCurrentUser() {
        const token = this.extractToken(this.req)
        const { data, error } = await this.supabase.auth.getUser(token);

        if (error) {
            throw error;
        }

        return data.user;
    }
}