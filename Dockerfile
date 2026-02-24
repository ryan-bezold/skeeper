FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
ARG VITE_API_URL
ARG VITE_WS_URL
ARG VITE_ENV=production
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL
ENV VITE_ENV=$VITE_ENV
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=@skeeper/backend --prod /prod/backend

FROM base AS skeeper-backend
COPY --from=build /prod/backend /prod/backend
COPY --from=build /usr/src/app/apps/backend/dist /prod/backend/dist
WORKDIR /prod/backend
CMD sh -c "node ./node_modules/typeorm/cli.js migration:run -d dist/data-source.js && pnpm start:prod"

FROM nginx:alpine AS skeeper-frontend
COPY --from=build /usr/src/app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
