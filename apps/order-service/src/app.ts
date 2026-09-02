import fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import { ordersRoutes } from './features/orders/index.js';

export function createApp(): FastifyInstance {
  const app = fastify();

  // Health check
  app.get('/health', async () => {
    return { status: 'ok', service: 'order-service' };
  });

  // Регистрируем фичу заказов
  app.register(ordersRoutes);

  return app;
}
