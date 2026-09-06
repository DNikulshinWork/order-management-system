import { randomUUID } from 'node:crypto';
import fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import { notificationsRoutes } from '../features/notifications/index.js';
import { registerErrorHandler } from './error-handler.js';
import { buildLoggerOptions } from './logger.js';

export function createApp(): FastifyInstance {
  const app = fastify({
    logger: buildLoggerOptions(),
    genReqId: () => randomUUID(),
  });

  registerErrorHandler(app);

  app.get('/health', async () => {
    return { status: 'ok', service: 'notification-service' };
  });

  app.register(notificationsRoutes);

  app.addHook('onResponse', async (request, reply) => {
    if (reply.statusCode >= 400) {
      const logData: Record<string, unknown> = {
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        responseTime: reply.elapsedTime,
      };

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
