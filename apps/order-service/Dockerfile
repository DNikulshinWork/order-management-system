# Monorepo-aware image for order-service
FROM node:20.19.0-alpine AS base
RUN npm install -g pnpm@10.15.0
WORKDIR /app

FROM base AS build
# Placeholder for prisma.config / generate (no live DB needed at build time)
ENV DATABASE_URL=postgresql://order:order@127.0.0.1:5432/orders?schema=public

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/order-service ./apps/order-service
COPY tooling ./tooling

RUN pnpm install --frozen-lockfile --filter=@repo/order-service...
RUN pnpm build --filter=@repo/order-service
# Portable prod tree with resolved deps (no workspace: protocol left)
RUN pnpm --filter=@repo/order-service deploy --prod /deploy

WORKDIR /deploy
RUN npx prisma generate

FROM node:20.19.0-alpine AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
WORKDIR /app

COPY --from=build /deploy ./

RUN addgroup -S app && adduser -S app -G app \
  && chown -R app:app /app
USER app

EXPOSE 3000
CMD ["node", "dist/index.js"]
