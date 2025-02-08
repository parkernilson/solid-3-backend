import { seedProfilePictures } from "./0_profile_pictures/0_profile_pictures"

const seedStorage = async () => {
    try {
        await seedProfilePictures();
    } catch(error) {
        console.error(error);
    }
}

seedStorage();