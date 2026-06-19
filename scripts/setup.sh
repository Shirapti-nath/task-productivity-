#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env — update DATABASE_URL if needed."
fi

if [ ! -f frontend/.env.local ]; then
  cp frontend/.env.example frontend/.env.local
fi

echo "Installing dependencies..."
npm install
cd frontend && npm install && cd ..

echo "Running database migrations..."
npx prisma migrate deploy

echo ""
echo "Start the app in TWO terminals:"
echo ""
echo "  Terminal 1 (backend):"
echo "    cd $ROOT"
echo "    npm run start:dev"
echo ""
echo "  Terminal 2 (frontend):"
echo "    cd $ROOT/frontend"
echo "    npm run dev"
echo ""
echo "Then open http://localhost:3000"
