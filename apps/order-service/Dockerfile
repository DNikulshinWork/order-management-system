FROM node:20.19.0-alpine
WORKDIR /app

RUN npm install -g pnpm@10.15.0

COPY apps/order-service/package.json ./package.json
RUN pnpm install --prod --no-frozen-lockfile

COPY apps/order-service/dist ./dist
COPY apps/order-service/prisma ./prisma
COPY apps/order-service/prisma.config.ts ./prisma.config.ts
COPY apps/order-service/.env ./.env

# Генерируем Prisma клиент
RUN npx prisma generate

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["node", "dist/index.js"]
