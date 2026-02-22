FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@9.0.0

WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY turbo.json ./
COPY apps/frontend/package.json ./apps/frontend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY apps/frontend ./apps/frontend

# Development stage
FROM base AS development
CMD ["pnpm", "--filter", "@skeeper/frontend", "dev"]

# Production build
FROM base AS build
ARG VITE_API_URL
ARG VITE_WS_URL
ARG VITE_ENV=production
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL
ENV VITE_ENV=$VITE_ENV
RUN pnpm --filter @skeeper/frontend build

# Production stage
FROM nginx:alpine AS production
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
