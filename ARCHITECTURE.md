# Skeeper Architecture

## Overview

Skeeper is a monorepo application for tracking players' scores in games. It follows modern architectural patterns and best practices for both backend and frontend development.

## Technology Stack

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Real-time**: Socket.IO (WebSockets)
- **Architecture**: CLEAN Architecture

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **UI Library**: Chakra UI
- **State Management**: Zustand
- **Routing**: React Router v6
- **Real-time**: Socket.IO Client
- **Architecture**: Feature-Sliced Design (FSD)

### Infrastructure
- **Container Orchestration**: Docker Compose
- **Monorepo Tool**: Turborepo
- **Package Manager**: pnpm

## Backend Architecture (CLEAN)

The backend follows CLEAN Architecture principles, organized into distinct layers:

### Directory Structure

```
apps/backend/src/
├── domain/                 # Enterprise Business Rules
│   ├── entities/          # Core business entities
│   │   ├── player.entity.ts
│   │   └── room.entity.ts
│   └── repositories/      # Repository interfaces
│       ├── player.repository.interface.ts
│       └── room.repository.interface.ts
│
├── application/           # Application Business Rules
│   └── use-cases/        # Use case implementations
│       ├── player/
│       │   ├── create-player.use-case.ts
│       │   └── update-score.use-case.ts
│       └── room/
│           └── create-room.use-case.ts
│
├── infrastructure/        # Frameworks & Drivers
│   └── database/
│       ├── entities/      # TypeORM entities
│       │   ├── player.typeorm-entity.ts
│       │   └── room.typeorm-entity.ts
│       └── repositories/  # Repository implementations
│           ├── player.repository.ts
│           └── room.repository.ts
│
└── presentation/          # Interface Adapters
    ├── controllers/       # HTTP controllers
    │   ├── players.controller.ts
    │   └── rooms.controller.ts
    └── gateways/         # WebSocket gateways
        └── score.gateway.ts
```

### Layer Responsibilities

1. **Domain Layer**: Contains pure business logic, entities, and repository interfaces. No dependencies on external frameworks.

2. **Application Layer**: Implements use cases that orchestrate domain entities. Depends only on domain layer.

3. **Infrastructure Layer**: Implements repository interfaces using TypeORM. Handles database operations and external services.

4. **Presentation Layer**: HTTP controllers and WebSocket gateways. Handles user input and presents data.

### Dependency Rule

Dependencies point inward:
- Presentation → Application → Domain
- Infrastructure → Domain (implements interfaces)

## Frontend Architecture (FSD)

The frontend follows Feature-Sliced Design methodology for better scalability and maintainability.

### Directory Structure

```
apps/frontend/src/
├── app/                   # Application initialization
│   ├── providers/        # React providers (router, theme)
│   │   ├── router.tsx
│   │   └── theme.tsx
│   ├── styles/           # Global styles
│   │   └── index.css
│   └── App.tsx
│
├── pages/                # Route-level components
│   ├── room-list/        # Room list page
│   │   ├── ui/
│   │   └── index.ts
│   └── room/             # Single room page
│       ├── ui/
│       └── index.ts
│
├── widgets/              # Large composite components
│   └── (to be added)
│
├── features/             # User interactions & business features
│   └── (to be added)
│
├── entities/             # Business entities
│   ├── room/
│   │   ├── api/          # API methods
│   │   │   └── roomApi.ts
│   │   └── model/        # Types & models
│   │       └── types.ts
│   └── player/
│       ├── api/
│       │   └── playerApi.ts
│       └── model/
│           └── types.ts
│
└── shared/               # Reusable infrastructure code
    └── api/              # API client & websocket
        ├── client.ts
        └── websocket.ts
```

### Layer Responsibilities

1. **app**: Application setup, providers, and global configuration
2. **pages**: Complete pages corresponding to routes
3. **widgets**: Complex independent UI blocks used across pages
4. **features**: User scenarios and interactions (adding players, updating scores)
5. **entities**: Business domain models and their operations
6. **shared**: Reusable utilities, UI kit, and API clients

### Import Rule

Higher layers can import from lower layers:
- app → pages → widgets → features → entities → shared

## Real-time Communication

### WebSocket Events

**Client → Server**:
- `subscribe_to_player`: Subscribe to a player's score changes
- `unsubscribe_from_player`: Unsubscribe from a player's score changes

**Server → Client**:
- `score_changed`: Notifies when a player's score changes

### Score Update Flow

1. User updates score via HTTP API (POST/PATCH)
2. Backend updates database via repository
3. Backend emits WebSocket event to subscribed clients
4. Frontend receives event and updates UI

## Database Schema

### Tables

**rooms**:
- id (UUID, PK)
- name (VARCHAR)
- share_code (VARCHAR, UNIQUE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**players**:
- id (UUID, PK)
- name (VARCHAR)
- score (INTEGER)
- room_id (UUID, FK → rooms.id)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## API Endpoints

### Rooms
- `POST /rooms` - Create a new room
- `GET /rooms` - List all rooms
- `GET /rooms/:id` - Get room details
- `PATCH /rooms/:id` - Update room name
- `DELETE /rooms/:id` - Delete a room

### Players
- `POST /rooms/:roomId/players` - Add player to room
- `GET /rooms/:roomId/players` - List players in room
- `PATCH /rooms/_/players/:id/score` - Update player score
- `PATCH /rooms/_/players/:id` - Update player name
- `DELETE /rooms/_/players/:id` - Remove player

## Development Workflow

### Running Locally

```bash
# Install dependencies
pnpm install

# Start development servers (both frontend and backend)
pnpm dev

# Or with Docker
pnpm docker:up
```

### Building for Production

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter @skeeper/backend build
pnpm --filter @skeeper/frontend build
```

## Design Principles

### Backend (CLEAN Architecture)
- **Single Responsibility**: Each class/module has one reason to change
- **Dependency Inversion**: Depend on abstractions, not concretions
- **Separation of Concerns**: Clear boundaries between layers
- **Testability**: Business logic independent of frameworks

### Frontend (FSD)
- **Isolation**: Features and entities are isolated modules
- **Explicit Dependencies**: Clear import rules between layers
- **Scalability**: Easy to add new features without affecting existing code
- **Maintainability**: Organized by business domain, not technical role

## Future Enhancements

- [ ] User authentication (optional)
- [ ] Room persistence and history
- [ ] Advanced scoring modes (rounds, teams)
- [ ] PWA support for offline functionality
- [ ] QR code generation for room sharing
- [ ] Player statistics and leaderboards
