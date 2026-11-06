#!/bin/sh
set -eu
checkpoint_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
project_dir=$(CDPATH= cd -- "$checkpoint_dir/../.." && pwd)
cp "$checkpoint_dir/src/app/page.tsx" "$project_dir/src/app/page.tsx"
cp "$checkpoint_dir/src/app/globals.css" "$project_dir/src/app/globals.css"
cp "$checkpoint_dir/src/components/steam-background.tsx" "$project_dir/src/components/steam-background.tsx"
printf '%s\n' 'Warm steam design restored.'
