# Task Productivity

Full-stack task management app to manage your day-to-day tasks.

| Layer | Technology |
|---|---|
| Frontend | React + Next.js |
| Backend | NestJS |
| Database | PostgreSQL + Prisma ORM |

## Features

- Create tasks with title and description
- Toggle task status (PENDING / COMPLETED)
- Delete tasks

## Local Development

**Prerequisites:** Node.js 18+, Docker (for PostgreSQL)

```bash
# 1. Start PostgreSQL
docker compose up -d

# 2. Backend setup
cp .env.example .env
npm install
npx prisma migrate deploy
npm run prisma:seed   # optional sample data

# 3. Frontend setup
cd frontend
cp .env.example .env.local
npm install

# 4. Run both (two terminals)
# Terminal 1 — backend (from repo root)
npm run start:dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## API Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/tasks` | List all tasks |
| `POST` | `/tasks` | Create a task |
| `PATCH` | `/tasks/:id` | Update a task (including status) |
| `DELETE` | `/tasks/:id` | Delete a task |

## Deployment

### Backend + Database (Render)

1. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
2. Connect this GitHub repo
3. Render creates the PostgreSQL database and NestJS API from `render.yaml`
4. Copy the API URL (e.g. `https://task-productivity-api.onrender.com`)

### Frontend (Vercel)

1. Go to [Vercel](https://vercel.com) → **Add New Project**
2. Import this repo
3. Set **Root Directory** to `frontend`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Render API URL
5. Deploy

### Finish CORS

In Render → **task-productivity-api** → **Environment**, set:

- `FRONTEND_URL` = your Vercel URL (e.g. `https://your-app.vercel.app`)

Then redeploy the API.

## Project Structure

```
task-productivity-/
├── frontend/          # Next.js app (port 3000)
├── src/               # NestJS API (port 3001)
├── prisma/            # Schema + migrations
├── docker-compose.yml # Local PostgreSQL
├── render.yaml        # Render deployment blueprint
└── README.md
```
