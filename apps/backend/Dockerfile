FROM node:20-alpine AS base
RUN npm install -g pnpm@9.0.0
WORKDIR /app

# Only copy manifests first for better layer caching
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY apps/backend/package.json ./apps/backend/package.json

# Cache pnpm store (requires DOCKER_BUILDKIT=1)
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Then copy source
COPY apps/backend ./apps/backend

FROM base AS development
CMD ["pnpm", "--filter", "@skeeper/backend", "dev"]

FROM base AS build
RUN pnpm --filter @skeeper/backend build

FROM node:20-alpine AS production
RUN npm install -g pnpm@9.0.0
WORKDIR /app
ENV NODE_ENV=production

# Copy only what we need to install runtime deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json

# Install prod deps for backend with cache
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prod --filter @skeeper/backend...

# Copy built output
COPY --from=build /app/apps/backend/dist ./dist

CMD ["node", "dist/main.js"]