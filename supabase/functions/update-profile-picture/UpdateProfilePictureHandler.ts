import { ServiceFactory } from "../_shared/factories/ServiceFactory.ts";
import { RequestHandler } from "../_shared/handlers/index.ts";
import { ProfileService } from "../_shared/services/ProfileService.ts";
import { UserService } from "../_shared/services/UserService.ts";

export class UpdateProfilePictureHandler extends RequestHandler {
    constructor(
        private profileService: ProfileService,
        private userService: UserService,
    ) {
        super();
    }

    async processRequest(req: Request): Promise<Response> {
        const fileType = req.headers.get("x-file-type");
        if (!fileType || this.profileService.isSupportedMimeType(fileType) === false) {
            return new Response("Invalid file type", { status: 400 });
        }

        const file = await req.bytes();

        const user = await this.userService.getCurrentUser();

        const { newPath } = await this.profileService.updateProfilePicture(
            user.id,
            file,
            fileType,
        );

        return new Response(
            JSON.stringify({ newPath }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }

    static getHandler(): (req: Request) => Promise<Response> {
        return (req: Request) => {
            const serviceFactory = ServiceFactory.getDefault();
            const handler = new UpdateProfilePictureHandler(
                serviceFactory.createProfileService(req),
                serviceFactory.createUserService(req),
            );
            return handler.handleRequestWithCors(req);
        }
    }
}
