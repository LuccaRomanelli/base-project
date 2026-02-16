#!/bin/bash
set -e

echo "==> Installing project dependencies..."

# Supabase CLI
brew install supabase/tap/supabase 2>&1 | cat || true

# Node dependencies
bun install

# Husky git hooks
bunx husky

# Trust mise.toml
mise trust 2>/dev/null || true

echo "==> Project dependencies installed!"
