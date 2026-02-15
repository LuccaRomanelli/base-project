#!/bin/bash
set -e

echo "Starting development environment..."

# Start Supabase
echo "Starting Supabase..."
npx supabase start

# Get Supabase status and update .env.local
echo "Updating .env.local..."
STATUS=$(npx supabase status --output json 2>/dev/null)
JSON_START=$(echo "$STATUS" | grep -n '{' | head -1 | cut -d: -f1)
if [ -n "$JSON_START" ]; then
  STATUS=$(echo "$STATUS" | tail -n +"$JSON_START")
fi

SUPABASE_URL=$(echo "$STATUS" | jq -r '.API_URL // "http://127.0.0.1:54321"')
ANON_KEY=$(echo "$STATUS" | jq -r '.ANON_KEY')

cat > .env.local << EOF
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${ANON_KEY}
EOF

echo ".env.local updated"

# Start Vite
echo "Starting Vite dev server..."
npm run dev
