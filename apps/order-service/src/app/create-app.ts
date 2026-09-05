import { randomUUID } from 'node:crypto';
import fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import { ordersRoutes } from '../features/orders/index.js';
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

  return app;
}
