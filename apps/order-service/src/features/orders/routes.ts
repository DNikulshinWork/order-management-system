import type { FastifyInstance } from 'fastify';
import * as repository from './repository.js';
import type { CreateOrderInput, UpdateOrderInput } from './types.js';

const createOrderSchema = {
  body: {
    type: 'object',
    required: ['items', 'total'],
    properties: {
      items: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['productId', 'quantity', 'price'],
          properties: {
            productId: { type: 'string', minLength: 1 },
            quantity: { type: 'number', minimum: 1 },
            price: { type: 'number', minimum: 0 },
          },
        },
      },
      total: { type: 'number', minimum: 0 },
    },
  },
};

const updateOrderSchema = {
  body: {
    type: 'object',
    additionalProperties: false,
    properties: {
      status: {
        type: 'string',
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      },
      items: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['productId', 'quantity', 'price'],
          properties: {
            productId: { type: 'string', minLength: 1 },
            quantity: { type: 'number', minimum: 1 },
            price: { type: 'number', minimum: 0 },
          },
        },
      },
      total: { type: 'number', minimum: 0 },
    },
  },
};

function notFound(message = 'Order not found'): Error & { statusCode: number } {
  const err = new Error(message) as Error & { statusCode: number };
  err.statusCode = 404;
  return err;
}

export async function ordersRoutes(app: FastifyInstance) {
  app.get('/orders', async () => {
    return repository.getOrders();
  });

  app.get('/orders/:id', async (request) => {
    const { id } = request.params as { id: string };
    const order = await repository.getOrderById(id);
    if (!order) {
      throw notFound();
    }
    return order;
  });

  app.post('/orders', { schema: createOrderSchema }, async (request) => {
    const input = request.body as CreateOrderInput;
    return repository.createOrder(input);
  });

  app.put('/orders/:id', { schema: updateOrderSchema }, async (request) => {
    const { id } = request.params as { id: string };
    const input = request.body as UpdateOrderInput;
    const updated = await repository.updateOrder(id, input);
    if (!updated) {
      throw notFound();
    }
    return updated;
  });

  app.delete('/orders/:id', async (request) => {
    const { id } = request.params as { id: string };
    const deleted = await repository.deleteOrder(id);
    if (!deleted) {
      throw notFound();
    }
    return { success: true };
  });
}
