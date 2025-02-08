import { SupabaseDomainConverter } from "../model/converters/SupabaseDomainConverter.ts";
import { IUserProfile } from "../model/domain/index.ts";
import type {
    SupabaseAdmin,
    SupabaseAuthenticated,
    SupabaseClient,
} from "../supabase/supabase.ts";

export type SupportedMimeType = "image/jpeg" | "image/png";

interface UploadFileResponse {
    path: string;
    name: string;
}

interface UpdateProfilePictureResponse {
    newPath: string;
}

export class ProfileService {
    private supabase: SupabaseClient;
    private supabaseAdmin: SupabaseClient;
    private converter = new SupabaseDomainConverter();

    private readonly supportedMimeTypes: SupportedMimeType[] = [
        "image/jpeg",
        "image/png",
    ];

    private profilePicturesBucket = "profile_pictures";

    constructor(
        { supabase }: SupabaseAuthenticated,
        { supabase: supabaseAdmin }: SupabaseAdmin,
    ) {
        this.supabase = supabase;
        this.supabaseAdmin = supabaseAdmin;
    }

    public isSupportedMimeType(
        mimeType: string,
    ): mimeType is SupportedMimeType {
        return this.supportedMimeTypes.includes(mimeType as SupportedMimeType);
    }

    private generateFileName(fileType: SupportedMimeType) {
        return `${Date.now()}.${fileType.split("/")[1]}`;
    }

    public async updateProfile(
        userId: string,
        newValues: Partial<Omit<IUserProfile, "id">>,
    ): Promise<IUserProfile> {
        const { data, error } = await this.supabase.rpc("update_profile", {
            _user_id: userId,
            _email: newValues.email,
            _profile_image_path: newValues.profileImagePath,
        });
        if (error) throw error;
        return this.converter.convertProfile(data);
    }

    private async uploadProfilePicture(
        userId: string,
        bytes: Uint8Array,
        mimeType: SupportedMimeType,
    ): Promise<UploadFileResponse> {
        const fileName = this.generateFileName(mimeType);
        const { data, error } = await this.supabaseAdmin.storage.from(
            "profile_pictures",
        ).upload(`${userId}/${fileName}`, bytes, {
            contentType: mimeType,
        });

        if (error) throw error;
        return {
            path: data.path,
            name: fileName
        };
    }

    private async deleteAllOtherProfilePictures(
        userId: string,
        except: string,
    ): Promise<void> {
        const { data, error } = await this.supabaseAdmin.storage.from(
            this.profilePicturesBucket,
        ).list(`${userId}`);

        if (error) throw error;

        const listToDelete = data.map(f => `${userId}/${f.name}`).filter((f) => f !== except);
        if (listToDelete.length === 0) return;

        const { error: deleteError } = await this.supabaseAdmin.storage.from(
            this.profilePicturesBucket,
        ).remove(listToDelete);

        if (deleteError) throw deleteError;
    }

    public async updateProfilePicture(
        userId: string,
        fileBytes: Uint8Array,
        mimeType: SupportedMimeType,
    ): Promise<UpdateProfilePictureResponse> {
        const { path, name } = await this.uploadProfilePicture(
            userId,
            fileBytes,
            mimeType,
        );
        const newProfile = await this.updateProfile(userId, {
            profileImagePath: name,
        });
        await this.deleteAllOtherProfilePictures(userId, path);
        return { newPath: newProfile.profileImagePath ?? "" };
    }
}
