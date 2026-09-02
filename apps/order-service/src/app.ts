import fastify from 'fastify';
import type { FastifyInstance } from 'fastify';

export function createApp(): FastifyInstance {
  const app = fastify();

  app.get('/health', async () => {
    return { status: 'ok', service: 'order-service' };
  });

  return app;
}
