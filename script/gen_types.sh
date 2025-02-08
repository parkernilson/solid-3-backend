#!/usr/bin/env sh
source $PWD/.env

PROJECT_ROOT=$(git rev-parse --show-toplevel)

TYPES=$(supabase gen types typescript --local)
OUT_FILE_PATH=$PROJECT_ROOT/../web/src/lib/supabase/database.types.ts
OUT_FILE_PATH_2=$PROJECT_ROOT/supabase/functions/_shared/supabase/database.types.ts
OUT_FILE_PATH_3=$PROJECT_ROOT/supabase/seed/seed_storage/supabase/database.types.ts
OUT_FILE_PATH_4=$PROJECT_ROOT/../playground/database.types.ts

# Prompt the user
echo "Write types to files:\n$OUT_FILE_PATH\n$OUT_FILE_PATH_2\n$OUT_FILE_PATH_3\n$OUT_FILE_PATH_4\n(y/n)"
read -r response

# Handle the user's response
case "$response" in
  y|Y)
    echo "Writing types to output locations..."
    # Add your code here to write types to the file
    supabase gen types typescript --local > $OUT_FILE_PATH
    cp $OUT_FILE_PATH $OUT_FILE_PATH_2
    cp $OUT_FILE_PATH $OUT_FILE_PATH_3
    cp $OUT_FILE_PATH $OUT_FILE_PATH_4
    ;;
  *)
    echo "Exiting..."
    exit 0
    ;;
esac
