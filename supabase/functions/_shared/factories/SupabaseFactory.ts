import { createClient } from "jsr:@supabase/supabase-js";
import type { Database } from "../supabase/database.types.ts";

import type {
    SupabaseAdmin,
    SupabaseAnon,
    SupabaseAuthenticated,
    SupabaseClient,
} from "../supabase/supabase.ts";

export class SupabaseFactory {
    private createClient({ 
        serviceRole = false,
        authHeader,
    }: {
        serviceRole?: boolean,
        authHeader?: string,
    }): SupabaseClient {
        if (!Deno.env.get("SUPABASE_URL")) {
            throw new Error("SUPABASE_URL env var is required");
        }
        if (!Deno.env.get("SUPABASE_ANON_KEY")) {
            throw new Error("SUPABASE_ANON_KEY env var is required");
        }
        if (!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) {
            throw new Error("SUPABASE_SERVICE_ROLE_KEY env var is required");
        }

        return createClient<Database>(
            Deno.env.get("SUPABASE_URL")!,
            serviceRole
                ? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
                : Deno.env.get("SUPABASE_ANON_KEY")!,
            authHeader ? {
                global: {
                    headers: {
                        Authorization: authHeader,
                    }
                }
            } : undefined
        );
    }

    public createSupabaseAnon(): SupabaseAnon {
        return {
            supabase: this.createClient({}),
            role: "anon",
        };
    }

    public createSupabaseAdmin(): SupabaseAdmin {
        return {
            supabase: this.createClient({ serviceRole: true }),
            role: "service_role",
        };
    }

    public createSupabaseAuthenticated(
        req: Request,
    ): SupabaseAuthenticated {
        const authHeader = req.headers.get("Authorization")!;
        return {
            supabase: this.createClient({ authHeader }),
            role: "authenticated",
        };
    }
}
