FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@9.0.0

WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY apps/backend ./apps/backend
COPY turbo.json ./

# Development stage
FROM base AS development
CMD ["pnpm", "--filter", "@skeeper/backend", "dev"]

# Production build
FROM base AS build
RUN pnpm --filter @skeeper/backend build

# Production stage
FROM node:20-alpine AS production
RUN npm install -g pnpm@9.0.0
WORKDIR /app

COPY --from=build /app/apps/backend/dist ./dist
COPY --from=build /app/apps/backend/package.json ./
COPY --from=build /app/node_modules ./node_modules

CMD ["node", "dist/main.js"]
