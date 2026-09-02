FROM node:20.19.0-alpine
WORKDIR /app

RUN apk add --no-cache curl  # Добавляем curl для отладки

RUN npm install -g pnpm@10.15.0

# Копируем package.json и устанавливаем prod зависимости
COPY apps/order-service/package.json ./package.json
RUN pnpm install --prod --no-frozen-lockfile

# Копируем собранный dist и миграции
COPY apps/order-service/dist ./dist
COPY apps/order-service/src/db/migrations ./dist/db/migrations

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["node", "dist/index.js"]
