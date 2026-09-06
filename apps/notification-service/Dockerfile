FROM node:20.19.0-alpine AS base
RUN npm install -g pnpm@10.15.0
WORKDIR /app

FROM base AS build
ENV DATABASE_URL=postgresql://notification:notification@127.0.0.1:5433/notifications?schema=public

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/notification-service ./apps/notification-service
COPY tooling ./tooling

RUN pnpm install --frozen-lockfile --filter=@repo/notification-service...
RUN pnpm build --filter=@repo/notification-service
RUN pnpm --filter=@repo/notification-service deploy --prod --legacy /deploy

WORKDIR /deploy
RUN npx prisma generate

FROM node:20.19.0-alpine AS runner
ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0
WORKDIR /app

COPY --from=build /deploy ./

RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app

EXPOSE 3001
CMD ["node", "-r", "tsconfig-paths/register", "dist/index.js"]