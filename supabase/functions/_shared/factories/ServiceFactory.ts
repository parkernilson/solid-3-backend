import { ProfileService } from "../services/ProfileService.ts";
import { UserService } from "../services/UserService.ts";
import type { SupabaseAdmin, SupabaseAnon } from "../supabase/supabase.ts";
import { SupabaseFactory } from "./SupabaseFactory.ts";

export class ServiceFactory {
    private supabaseAnonInstance: SupabaseAnon;
    private supabaseAdminInstance: SupabaseAdmin;

    constructor(private supabaseFactory: SupabaseFactory) {
        this.supabaseAnonInstance = supabaseFactory.createSupabaseAnon();
        this.supabaseAdminInstance = supabaseFactory.createSupabaseAdmin();
    }

    createProfileService(req: Request) {
        return new ProfileService(
            this.supabaseFactory.createSupabaseAuthenticated(req),
            this.supabaseAdminInstance
        );
    }

    createUserService(req: Request) {
        return new UserService(this.supabaseFactory.createSupabaseAuthenticated(req), req);
    }

    static getDefault() {
        return new ServiceFactory(new SupabaseFactory());
    }
}