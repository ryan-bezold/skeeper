# Skeeper

An application for tracking players' scores in a game.

## Features

- **Score Keeping**: Track player scores with increment, decrement, and set operations
- **Game Rooms**: Create and manage multiple game rooms
- **Players**: Add, remove, and rename players in rooms
- **Real-time Updates**: Subscribe to score changes for specific players
- **Room Sharing**: Share game rooms via QR codes

## Stack

- **Backend**: NestJS with CLEAN Architecture
- **Frontend**: Vite with Feature-Sliced Design (FSD)
- **Database**: PostgreSQL
- **Orchestration**: Docker Compose

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Docker and Docker Compose

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start development servers
pnpm dev

# Start with Docker
pnpm docker:up
```

### Project Structure

```
skeeper/
├── apps/
│   ├── backend/     # NestJS API
│   └── frontend/    # Vite frontend
├── packages/        # Shared packages
└── docker-compose.yml
```

## Architecture

### Backend (CLEAN Architecture)

The backend follows CLEAN Architecture principles with the following layers:
- **Domain**: Entities and business rules
- **Application**: Use cases and application logic
- **Infrastructure**: External services, database, and frameworks
- **Presentation**: Controllers and DTOs

### Frontend (Feature-Sliced Design)

The frontend follows FSD methodology with:
- **app**: Application-level initialization
- **pages**: Route-level components
- **widgets**: Large composite components
- **features**: User interactions and business features
- **entities**: Business entities
- **shared**: Reusable infrastructure code

## License

MIT
