# Quick Start Guide

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Docker and Docker Compose (optional, for containerized development)

## Installation

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up environment variables**:

   Backend:
   ```bash
   cd apps/backend
   cp .env.example .env
   # Edit .env if needed
   ```

   Frontend:
   ```bash
   cd apps/frontend
   cp .env.example .env
   # Edit .env if needed
   ```

## Running the Application

### Option 1: With Docker (Recommended)

```bash
# Start all services (PostgreSQL, Backend, Frontend)
pnpm docker:up

# View logs
pnpm docker:logs

# Stop all services
pnpm docker:down
```

Access the application at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### Option 2: Local Development

1. **Start PostgreSQL** (you need PostgreSQL running locally):
   ```bash
   # Using Docker for just the database
   docker run -d \
     --name skeeper-postgres \
     -e POSTGRES_DB=skeeper \
     -e POSTGRES_USER=skeeper \
     -e POSTGRES_PASSWORD=skeeper_dev_password \
     -p 5432:5432 \
     postgres:16-alpine
   ```

2. **Start the backend**:
   ```bash
   pnpm --filter @skeeper/backend dev
   ```

3. **Start the frontend** (in a new terminal):
   ```bash
   pnpm --filter @skeeper/frontend dev
   ```

### Option 3: Run All with Turbo

```bash
# Starts both frontend and backend
pnpm dev
```

## Project Structure

```
skeeper/
├── apps/
│   ├── backend/              # NestJS API (CLEAN Architecture)
│   │   └── src/
│   │       ├── domain/       # Business entities & interfaces
│   │       ├── application/  # Use cases
│   │       ├── infrastructure/ # Database & external services
│   │       └── presentation/ # Controllers & gateways
│   │
│   └── frontend/             # Vite + React (FSD Architecture)
│       └── src/
│           ├── app/          # App initialization
│           ├── pages/        # Route pages
│           ├── widgets/      # Composite components
│           ├── features/     # User interactions
│           ├── entities/     # Business entities
│           └── shared/       # Shared utilities
│
├── docker-compose.yml        # Docker orchestration
├── package.json             # Root package.json
├── pnpm-workspace.yaml      # Workspace configuration
└── turbo.json              # Turborepo configuration
```

## Available Scripts

### Root Level
- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps
- `pnpm test` - Run tests for all apps
- `pnpm lint` - Lint all apps
- `pnpm docker:up` - Start Docker containers
- `pnpm docker:down` - Stop Docker containers
- `pnpm docker:logs` - View Docker logs

### Backend
- `pnpm --filter @skeeper/backend dev` - Start backend in watch mode
- `pnpm --filter @skeeper/backend build` - Build backend
- `pnpm --filter @skeeper/backend test` - Run backend tests

### Frontend
- `pnpm --filter @skeeper/frontend dev` - Start frontend dev server
- `pnpm --filter @skeeper/frontend build` - Build frontend
- `pnpm --filter @skeeper/frontend preview` - Preview production build

## Key Features Implemented

### Backend
- ✅ CLEAN Architecture with clear layer separation
- ✅ TypeORM integration with PostgreSQL
- ✅ WebSocket support for real-time updates
- ✅ Basic CRUD operations for rooms and players
- ✅ Score update use cases (increment, decrement, set)

### Frontend
- ✅ Feature-Sliced Design architecture
- ✅ Chakra UI integration with dark mode
- ✅ React Router for navigation
- ✅ API client setup
- ✅ WebSocket client setup
- ✅ Basic room and player pages

## Next Steps

1. **Complete remaining use cases**:
   - List rooms
   - Get room details
   - Delete room
   - List players
   - Update player name
   - Delete player

2. **Implement features**:
   - Player score cards
   - Real-time score notifications
   - QR code generation for room sharing
   - Room sharing via QR scan

3. **Add tests**:
   - Unit tests for use cases
   - Integration tests for repositories
   - E2E tests for critical flows

4. **Enhance UI**:
   - Responsive design
   - Loading states
   - Error handling
   - Toast notifications

## Troubleshooting

### Port already in use
If you get port conflicts:
- Backend (3000): Change `PORT` in `apps/backend/.env`
- Frontend (5173): Change port in `apps/frontend/vite.config.ts`
- PostgreSQL (5432): Change port in `docker-compose.yml`

### Database connection failed
- Ensure PostgreSQL is running
- Check connection details in `apps/backend/.env`
- Verify database exists: `psql -U skeeper -d skeeper`

### Module not found
- Run `pnpm install` in the root directory
- Clear cache: `rm -rf node_modules && pnpm install`

## Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [Specification](../Documents/Obsidian\ Vault/Projects/Skeeper/Specification.md)
- [README](./README.md)
