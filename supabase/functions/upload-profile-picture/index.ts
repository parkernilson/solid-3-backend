// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (req) => {
  const fileType = req.headers.get('x-file-type');
  const fileName = req.headers.get('x-file-name');

  const file = await req.bytes();

  // TODO: upload the file to supabase storage
  // TODO: update the user's profile picture url in the database
  // TODO: delete the old profile picture

  return new Response(
    JSON.stringify({
      fileType,
      fileName,
      fileSize: file.byteLength,
    }),
    { headers: { "Content-Type": "application/json" } },
  )
})
