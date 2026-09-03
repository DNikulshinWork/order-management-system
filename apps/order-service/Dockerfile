FROM node:20.19.0-alpine AS base
WORKDIR /app
RUN npm install -g pnpm@10.15.0

FROM base AS deps
COPY apps/order-service/package.json ./package.json
RUN pnpm install --prod --no-frozen-lockfile

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY apps/order-service/package.json ./package.json
COPY apps/order-service/dist ./dist
COPY apps/order-service/prisma ./prisma
COPY apps/order-service/prisma.config.ts ./prisma.config.ts

RUN npx prisma generate

RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 3000
CMD ["node", "dist/index.js"]
