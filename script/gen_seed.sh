#!/bin/bash

PROJECT_ROOT=$(git rev-parse --show-toplevel)

cat $PROJECT_ROOT/supabase/seed/seed_sql/**/*.sql >> supabase/seed.sql