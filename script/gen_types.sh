#!/usr/bin/env sh
source $PWD/.env

PROJECT_ROOT=$(git rev-parse --show-toplevel)

TYPES=$(supabase gen types typescript --local)
OUT_FILE_PATH=$PROJECT_ROOT/../web/src/lib/supabase/database.types.ts
OUT_FILE_PATH_2=$PROJECT_ROOT/supabase/database.types.ts

# Prompt the user
echo "Write types to file $OUT_FILE_PATH and $OUT_FILE_PATH_2? (y/n)"
read -r response

# Handle the user's response
case "$response" in
  y|Y)
    echo "Writing types to $OUT_FILE_PATH..."
    # Add your code here to write types to the file
    supabase gen types typescript --local > $OUT_FILE_PATH
    cp $OUT_FILE_PATH $OUT_FILE_PATH_2
    ;;
  *)
    echo "Exiting..."
    exit 0
    ;;
esac
