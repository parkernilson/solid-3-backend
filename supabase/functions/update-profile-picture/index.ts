// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { UpdateProfilePictureHandler } from "./UpdateProfilePictureHandler.ts";

Deno.serve(UpdateProfilePictureHandler.getHandler());