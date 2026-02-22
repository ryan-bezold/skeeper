# Skeeper - Project Summary

## What Has Been Created

A complete monorepo scaffolding for the Skeeper score-keeping application with:

### Backend (NestJS with CLEAN Architecture)
✅ **Domain Layer**
- Player entity with score management methods
- Room entity with share code generation
- ScoreHistory entity for tracking score changes
- Repository interfaces for all entities

✅ **Application Layer**
- Create room use case
- Create player use case
- Update score use case (increment, decrement, set) with automatic history tracking
- Get player score history use case
- Get room score history use case

✅ **Infrastructure Layer**
- TypeORM entities for Player, Room, and ScoreHistory
- PostgreSQL repository implementations
- Database migration support via TypeORM synchronize (dev mode)

✅ **Presentation Layer**
- REST API controllers for rooms, players, and score history
- WebSocket gateway for real-time score notifications
- Proper dependency injection with symbols

### Frontend (Vite + React with FSD Architecture)
✅ **App Layer**
- Chakra UI theme provider with dark mode
- React Router setup
- Global styles

✅ **Pages Layer**
- Room list page with "Create Room" functionality
- Room detail page (scaffold)

✅ **Widgets Layer**
- ScoreHistoryList component for displaying score change history
- Visual indicators for score increases/decreases
- Timestamped history entries

✅ **Entities Layer**
- Room entity with API methods (create, get, update, delete)
- Player entity with API methods (create, get, update score, update name, delete)
- ScoreHistory entity with API methods (get by player, get by room)

✅ **Shared Layer**
- API client with REST methods
- WebSocket client setup
- TypeScript type definitions

### Infrastructure
✅ **Docker Compose**
- PostgreSQL database service
- Backend service with hot reload
- Frontend service with hot reload
- Health checks and proper networking

✅ **Monorepo Setup**
- pnpm workspaces configuration
- Turborepo for task orchestration
- Shared TypeScript configurations
- Proper .gitignore

## Database Schema

### Tables Created (Auto-migrated in dev mode)

**rooms**
```sql
- id: UUID (PK)
- name: VARCHAR
- share_code: VARCHAR (UNIQUE)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**players**
```sql
- id: UUID (PK)
- name: VARCHAR
- score: INTEGER (default: 0)
- room_id: UUID (FK → rooms.id, CASCADE)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**score_history** (NEW!)
```sql
- id: UUID (PK)
- player_id: UUID (FK → players.id, CASCADE)
- previous_score: INTEGER
- new_score: INTEGER
- change_amount: INTEGER
- change_type: VARCHAR ('increment' | 'decrement' | 'set')
- created_at: TIMESTAMP
```

## API Endpoints Implemented

### Rooms
- `POST /rooms` - Create a new room
- `GET /rooms` - List all rooms (TODO)
- `GET /rooms/:id` - Get room details (TODO)
- `PATCH /rooms/:id` - Update room name (TODO)
- `DELETE /rooms/:id` - Delete a room (TODO)

### Players
- `POST /rooms/:roomId/players` - Add player to room
- `GET /rooms/:roomId/players` - List players in room (TODO)
- `PATCH /rooms/_/players/:id/score` - Update player score
- `PATCH /rooms/_/players/:id` - Update player name (TODO)
- `DELETE /rooms/_/players/:id` - Remove player (TODO)

### Score History (NEW!)
- `GET /players/:playerId/score-history` - Get score history for a player
- `GET /rooms/:roomId/score-history` - Get all score changes in a room

### WebSocket Events
- `subscribe_to_player` - Subscribe to player score changes
- `unsubscribe_from_player` - Unsubscribe from player score changes
- `score_changed` - Event emitted when score changes

## Key Features

### Score History Tracking
Every score change is automatically recorded with:
- Previous score value
- New score value
- Change amount (calculated)
- Change type (increment/decrement/set)
- Timestamp

This allows you to:
- View complete game history
- Track individual player performance over time
- See all changes in a room chronologically
- Analyze scoring patterns

### CLEAN Architecture Benefits
- ✅ Business logic independent of frameworks
- ✅ Testable use cases
- ✅ Clear dependency rules
- ✅ Easy to swap implementations (e.g., different database)

### FSD Architecture Benefits
- ✅ Scalable feature organization
- ✅ Clear import rules between layers
- ✅ Isolated, reusable components
- ✅ Domain-driven structure

## File Structure
```
skeeper/
├── apps/
│   ├── backend/                      # NestJS API
│   │   ├── src/
│   │   │   ├── domain/              # Business entities & rules
│   │   │   │   ├── entities/
│   │   │   │   │   ├── player.entity.ts
│   │   │   │   │   ├── room.entity.ts
│   │   │   │   │   └── score-history.entity.ts
│   │   │   │   └── repositories/    # Repository interfaces
│   │   │   ├── application/         # Use cases
│   │   │   │   ├── use-cases/
│   │   │   │   │   ├── player/
│   │   │   │   │   ├── room/
│   │   │   │   │   └── score-history/
│   │   │   ├── infrastructure/      # External services
│   │   │   │   └── database/
│   │   │   │       ├── entities/    # TypeORM entities
│   │   │   │       └── repositories/
│   │   │   └── presentation/        # Controllers & gateways
│   │   │       ├── controllers/
│   │   │       └── gateways/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── frontend/                     # Vite + React
│       ├── src/
│       │   ├── app/                 # App initialization
│       │   ├── pages/               # Route pages
│       │   ├── widgets/             # Composite components
│       │   │   └── score-history/   # Score history widget
│       │   ├── features/            # User interactions
│       │   ├── entities/            # Business entities
│       │   │   ├── room/
│       │   │   ├── player/
│       │   │   └── score-history/
│       │   └── shared/              # Shared utilities
│       ├── Dockerfile
│       └── package.json
│
├── docker-compose.yml               # Orchestration
├── package.json                     # Root package.json
├── pnpm-workspace.yaml             # Workspace config
├── turbo.json                      # Turborepo config
├── README.md                       # Project overview
├── ARCHITECTURE.md                 # Architecture details
├── QUICK_START.md                  # Setup instructions
└── PROJECT_SUMMARY.md              # This file
```

## Next Steps to Complete the Application

### Backend TODO
1. Implement remaining use cases:
   - Get all rooms
   - Get room by ID
   - Update room name
   - Delete room
   - Get players by room
   - Update player name
   - Delete player

2. Add validation:
   - DTOs with class-validator decorators
   - Score limits (if any)
   - Room name length restrictions

3. Enhance WebSocket gateway:
   - Emit score_changed events when scores update
   - Room-level subscriptions

4. Add tests:
   - Unit tests for entities
   - Unit tests for use cases
   - Integration tests for repositories
   - E2E tests for API endpoints

### Frontend TODO
1. Complete room list page:
   - Fetch and display rooms
   - Delete room functionality
   - Edit room name inline

2. Complete room detail page:
   - Display player list
   - Add player functionality
   - Player score cards with increment/decrement buttons
   - Score history view (already created widget!)

3. Implement features:
   - Real-time score updates via WebSocket
   - QR code generation for room sharing
   - QR code scanner to join rooms
   - Toast notifications for score changes

4. UI enhancements:
   - Loading states
   - Error boundaries
   - Responsive design
   - Animations

5. Add state management:
   - Zustand store for rooms
   - Zustand store for players
   - WebSocket connection management

## Running the Project

### Quick Start
```bash
# Install dependencies
pnpm install

# Start with Docker (recommended)
pnpm docker:up

# Or run locally
pnpm dev
```

### Access
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- PostgreSQL: localhost:5432

See [QUICK_START.md](./QUICK_START.md) for detailed instructions.

## Technologies Used

**Backend:**
- NestJS 10.x
- TypeScript 5.x
- TypeORM 0.3.x
- PostgreSQL 16
- Socket.IO 4.x
- class-validator

**Frontend:**
- React 18.x
- Vite 5.x
- TypeScript 5.x
- Chakra UI 2.x
- React Router 6.x
- Socket.IO Client 4.x
- Zustand 4.x

**DevOps:**
- Docker & Docker Compose
- Turborepo 2.x
- pnpm 9.x

## License
MIT
