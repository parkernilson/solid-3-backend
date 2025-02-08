#!/bin/sh

PROJECT_ROOT=$(git rev-parse --show-toplevel)

source $PROJECT_ROOT/supabase/.env.local

SUPABASE_URL=$SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY bun $PROJECT_ROOT/supabase/seed/seed_storage/index.ts;