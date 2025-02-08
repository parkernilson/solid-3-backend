import { supabaseAdmin } from "../supabase/supabase";

const basePath = "./supabase/seed/seed_storage/0_profile_pictures/profile_pictures";

const addProfilePicture = async (
    email: string,
    filePath: string,
    mimeType: string,
) => {
    const { data: userData } = await supabaseAdmin.from("profiles").select("*").eq(
        "email",
        email,
    ).single().throwOnError();

    const bunFile = Bun.file(`${basePath}/${filePath}`)
    const file = await bunFile.bytes();
    const ext = filePath.split(".")[1];
    const bucketPath = `${userData.id}/${Date.now()}.${ext}`;
    const shortPath = bucketPath.split("/")[1];
    const { error } = await supabaseAdmin.storage.from("profile_pictures")
        .upload(bucketPath, file, {
            contentType: mimeType,
        });
    if (error) throw error;
    const { error: profileError } = await supabaseAdmin.from("profiles")
        .update({ profile_image_path: shortPath })
        .eq("id", userData.id);
    if (profileError) throw profileError;
};

export async function seedProfilePictures() {
    try {
        console.log("Seeding profile pictures...");
        await addProfilePicture('danexample@gmail.com', 'danexample_small.png', 'image/png');
        await addProfilePicture('sabrinatest@gmail.com', 'sabrinatest_small.png', 'image/png');
        await addProfilePicture('greg@gmail.com', 'greg_small.png', 'image/png');
        console.log("Seeding profile pictures success.")
    } catch (error) {
        throw error;
    }
}
