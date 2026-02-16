#!/bin/bash
set -e

echo "=== Production Deploy ==="

# Run quality checks
echo "Running quality checks..."
bun run lint
bun run typecheck
bun run test

# Push database migrations
echo "Pushing database migrations..."
bunx supabase db push

# Deploy Edge Functions (if any)
if [ -d "supabase/functions" ] && [ "$(ls -A supabase/functions 2>/dev/null)" ]; then
  echo "Deploying Edge Functions..."
  for func_dir in supabase/functions/*/; do
    func_name=$(basename "$func_dir")
    if [ "$func_name" != ".gitkeep" ]; then
      echo "  Deploying $func_name..."
      bunx supabase functions deploy "$func_name"
    fi
  done
fi

# Build frontend
echo "Building frontend..."
bun run build

echo ""
echo "=== Deploy Complete ==="
echo "Deploy the dist/ folder to your hosting provider."
