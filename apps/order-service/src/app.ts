import fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import { ordersRoutes } from './features/orders/index.js';

export function createApp(): FastifyInstance {
  const app = fastify();

  // Глобальный обработчик ошибок
  app.setErrorHandler((error, _request, reply) => {
    if (error.statusCode === 404) {
      return reply.status(404).send({ error: 'Not Found', message: error.message });
    }
    // Валидационные ошибки Fastify
    if (error.validation) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: error.message,
        details: error.validation,
      });
    }
    // Все остальные ошибки
    return reply.status(error.statusCode || 500).send({
      error: error.name || 'Internal Server Error',
      message: error.message || 'Something went wrong',
    });
  });

  app.get('/health', async () => {
    return { status: 'ok', service: 'order-service' };
  });

  app.register(ordersRoutes);

  return app;
}
