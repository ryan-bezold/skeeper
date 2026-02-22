# Deployment Guide

This document covers environment configuration and deployment for all supported environments.

---

## Environment Variables

### Backend (`apps/backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | yes | `development` | Runtime environment (`development` \| `staging` \| `production`) |
| `PORT` | yes | `3000` | HTTP/WebSocket server port |
| `DATABASE_HOST` | yes | — | PostgreSQL hostname |
| `DATABASE_PORT` | yes | `5432` | PostgreSQL port |
| `DATABASE_NAME` | yes | — | Database name |
| `DATABASE_USER` | yes | — | Database user |
| `DATABASE_PASSWORD` | yes | — | Database password |
| `CORS_ORIGIN` | no | `http://localhost:5173` | Allowed CORS origin(s) |

> The backend **validates all required variables at startup** and exits with a descriptive error if any are missing or invalid.

### Frontend (`apps/frontend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | no | `http://localhost:3000` | Backend REST API base URL |
| `VITE_WS_URL` | no | `ws://localhost:3000` | WebSocket server URL |
| `VITE_ENV` | no | Vite `MODE` | Explicit environment label |

> Vite inlines these at **build time**. For production builds pass the correct URLs as build args or `.env.production`.

---

## Local Development

```bash
# 1. Copy and fill in the backend env file
cp apps/backend/.env.example apps/backend/.env

# 2. Copy and fill in the frontend env file
cp apps/frontend/.env.example apps/frontend/.env

# 3. Start the dev servers
pnpm dev
```

---

## Docker (Development)

```bash
# 1. Create the Docker env file from the example
cp .env.docker.example .env.docker

# 2. Edit .env.docker if needed, then start
docker compose up --build
```

The `.env.docker` file is loaded by all services via `env_file`. Hardcoded values are **not** present in `docker-compose.yml`.

---

## Docker (Production)

```bash
# 1. Create a production env file — never commit this file
cp .env.docker.example .env.prod
# Edit .env.prod with real credentials and your domain URLs

# 2. Build and start production containers
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

### Production secrets checklist

- [ ] `POSTGRES_PASSWORD` — use a strong, unique password
- [ ] `DATABASE_PASSWORD` — must match `POSTGRES_PASSWORD`
- [ ] `CORS_ORIGIN` — your frontend domain (e.g. `https://skeeper.example.com`)
- [ ] `VITE_API_URL` — your backend domain (e.g. `https://api.skeeper.example.com`)
- [ ] `VITE_WS_URL` — same host with `wss://` scheme

### Security notes

- Never commit `.env`, `.env.prod`, or `.env.docker` to version control.
  Only `*.example` files should be committed.
- In production, consider using Docker secrets or a secrets manager (Vault,
  AWS Secrets Manager) instead of env files for database passwords.

---

## Staging

```bash
# Build the frontend for staging
cp apps/frontend/.env.staging.example apps/frontend/.env.staging
# Edit .env.staging, then:
pnpm --filter @skeeper/frontend build --mode staging
```

---

## Environment File Reference

| File | Purpose | Committed? |
|---|---|---|
| `apps/backend/.env.example` | Backend template | ✅ yes |
| `apps/backend/.env` | Local backend config | ❌ no |
| `apps/frontend/.env.example` | Frontend template | ✅ yes |
| `apps/frontend/.env.staging.example` | Staging template | ✅ yes |
| `apps/frontend/.env` | Local frontend config | ❌ no |
| `apps/frontend/.env.staging` | Staging frontend config | ❌ no |
| `apps/frontend/.env.production` | Production frontend config | ❌ no |
| `.env.docker.example` | Docker template | ✅ yes |
| `.env.docker` | Local Docker config | ❌ no |
| `.env.prod` | Production Docker config | ❌ no |
