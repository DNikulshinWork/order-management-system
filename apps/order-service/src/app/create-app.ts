import { randomUUID } from 'node:crypto';
import fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import { ordersRoutes } from '@features/orders/index.js';
import { registerErrorHandler } from './error-handler.js';
import { buildLoggerOptions } from './logger.js';

/**
 * Слой app/: только сборка (bootstrap, middleware, транспорт).
 * Бизнес-логику сюда не добавляем — она живёт в features/.
 * См. docs/architecture/boundaries.md, раздел 4.
 */
export function createApp(): FastifyInstance {
  const app = fastify({
    logger: buildLoggerOptions(),
    genReqId: () => randomUUID(),
  });

  registerErrorHandler(app);

  app.get('/health', async () => {
    return { status: 'ok', service: 'order-service' };
  });

  app.register(ordersRoutes);

  app.addHook('onResponse', async (request, reply) => {
    if (reply.statusCode >= 400) {
      const logData: Record<string, unknown> = {
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        responseTime: reply.elapsedTime,
      };

      // Добавляем тело запроса, если оно есть и это не GET
      if (request.method !== 'GET' && request.body) {
        try {
          const bodyString =
            typeof request.body === 'string' ? request.body : JSON.stringify(request.body);
          logData.requestBody = bodyString.slice(0, 1000);
        } catch {
          // если сериализация не удалась, просто игнорируем
        }
      }

      request.log.error(logData, 'Request error details');
    }
  });

  return app;
}
