import type { Database } from "../supabase/database.types.ts";
import { createClient } from "jsr:@supabase/supabase-js";

import type {
    SupabaseAdmin,
    SupabaseAnon,
    SupabaseAuthenticated,
    SupabaseClient,
} from "../supabase/supabase.ts";

export class SupabaseFactory {
    public createSupabaseAnon(): SupabaseAnon {
        if (!Deno.env.get("SUPABASE_URL")) {
            throw new Error("SUPABASE_URL env var is required");
        }
        if (!Deno.env.get("SUPABASE_ANON_KEY")) {
            throw new Error("SUPABASE_ANON_KEY env var is required");
        }
        return {
            supabase: createClient<Database>(
                Deno.env.get("SUPABASE_URL")!,
                Deno.env.get("SUPABASE_ANON_KEY")!,
            ),
            role: "anon",
        };
    }

    public createSupabaseAdmin(): SupabaseAdmin {
        if (!Deno.env.get("SUPABASE_URL")) {
            throw new Error("SUPABASE_URL env var is required");
        }
        if (!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) {
            throw new Error("SUPABASE_SERVICE_ROLE_KEY env var is required");
        }
        return {
            supabase: createClient<Database>(
                Deno.env.get("SUPABASE_URL")!,
                Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
            ),
            role: "service_role",
        };
    }

    public async createSupabaseAuthenticated(
        req: Request,
    ): Promise<SupabaseAuthenticated> {
        if (!Deno.env.get("SUPABASE_URL")) {
            throw new Error("SUPABASE_URL env var is required");
        }
        if (!Deno.env.get("SUPABASE_ANON_KEY")) {
            throw new Error("SUPABASE_ANON_KEY env var is required");
        }

        const supabase: SupabaseClient = createClient<Database>(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_ANON_KEY")!,
        );

        // Get the session or user object
        const authHeader = req.headers.get("Authorization")!;
        const token = authHeader.replace("Bearer ", "");
        // TODO: fix this...
        // deno-lint-ignore ban-ts-comment
        // @ts-ignore
        const { error } = await supabase.auth.getUser(token);
        if (error) {
            throw error;
        }

        return {
            supabase,
            role: "authenticated",
        };
    }
}
