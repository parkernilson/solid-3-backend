import { IUserProfile } from "../domain/index.ts";
import { SupabaseProfile } from "../supabase/SupabaseProfile.ts";

export class SupabaseDomainConverter {
    convertProfile(profile: SupabaseProfile): IUserProfile {
        return {
            id: profile.id,
            email: profile.email,
            profileImagePath: profile.profile_image_path ?? undefined,
        };
    }
}