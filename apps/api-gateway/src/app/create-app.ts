import { randomUUID } from 'node:crypto';
import fastify from 'fastify';
import type { FastifyInstance, FastifyServerOptions } from 'fastify';
import proxy from '@fastify/http-proxy';

/**
 * Настройки логгера — минимальная копия из order-service, чтобы видеть
 * имя сервиса в логах и красивый вывод в dev через pino-pretty.
 */
function buildLoggerOptions(): NonNullable<FastifyServerOptions['logger']> {
  const isProduction = process.env.NODE_ENV === 'production';

  const baseOptions = {
    level: process.env.LOG_LEVEL ?? 'info',
    base: { service: 'api-gateway' },
  };

  if (isProduction) {
    return baseOptions;
  }

  return {
    ...baseOptions,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  };
}

/**
 * Создаёт и настраивает Fastify-инстанс API Gateway.
 *
 * Роутинг:
 *  - /health          → собственный хендлер (без прокси)
 *  - /api/orders/*    → прокси на order-service (префикс /api/orders → /orders)
 *  - /api/notifications/* → 503 (сервис пока не реализован)
 *  - всё остальное    → 404
 */
export function createApp(): FastifyInstance {
  const orderServiceUrl = process.env.ORDER_SERVICE_URL ?? 'http://order-service:3000';

  const app = fastify({
    logger: buildLoggerOptions(),
    genReqId: () => randomUUID(),
  });

  // ── Health-check ─────────────────────────────────────────────
  app.get('/health', async () => {
    return { status: 'ok', service: 'api-gateway' };
  });

  // ── Proxy: /api/orders → order-service:3000/orders ──────────
  app.register(proxy, {
    upstream: orderServiceUrl,
    prefix: '/api/orders',
    rewritePrefix: '/orders',
    preHandler: async (_request, reply) => {
      // Если upstream ещё не готов, можно проверить — но пока просто проксируем
      reply.header('x-proxied-by', 'api-gateway');
    },
  });

  // ── Заглушка для /api/notifications ──────────────────────────
  app.all('/api/notifications', async (_request, reply) => {
    return reply
      .status(503)
      .send({ error: 'Service Unavailable', message: 'Service not available' });
  });

  app.all('/api/notifications/*', async (_request, reply) => {
    return reply
      .status(503)
      .send({ error: 'Service Unavailable', message: 'Service not available' });
  });

  // ── Глобальный хук: логирование каждого запроса ──────────────
  app.addHook('onResponse', async (request, reply) => {
    const logData: Record<string, unknown> = {
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      responseTime: reply.elapsedTime,
    };

    request.log.info(logData, 'Request completed');
  });

  return app;
}
