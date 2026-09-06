FROM node:20.19.0-alpine AS base
RUN npm install -g pnpm@10.15.0
WORKDIR /app

FROM base AS build

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api-gateway ./apps/api-gateway
COPY tooling ./tooling

RUN pnpm install --frozen-lockfile --filter=@repo/api-gateway...
RUN pnpm build --filter=@repo/api-gateway
RUN pnpm --filter=@repo/api-gateway deploy --prod --legacy /deploy

FROM node:20.19.0-alpine AS runner
ENV NODE_ENV=production
ENV PORT=8000
ENV HOST=0.0.0.0
ENV ORDER_SERVICE_URL=http://order-service:3000
WORKDIR /app

COPY --from=build /deploy ./

RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app

EXPOSE 8000
CMD ["node", "dist/index.js"]