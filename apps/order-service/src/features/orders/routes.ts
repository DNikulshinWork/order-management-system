import type { FastifyInstance } from 'fastify';
import * as service from './service.js';
import type { CreateOrderInput, UpdateOrderInput } from './types.js';

// Схемы для валидации
const createOrderSchema = {
  body: {
    type: 'object',
    required: ['items', 'total'],
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          required: ['productId', 'quantity', 'price'],
          properties: {
            productId: { type: 'string' },
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
    properties: {
      status: {
        type: 'string',
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      },
      items: {
        type: 'array',
        items: {
          type: 'object',
          required: ['productId', 'quantity', 'price'],
          properties: {
            productId: { type: 'string' },
            quantity: { type: 'number', minimum: 1 },
            price: { type: 'number', minimum: 0 },
          },
        },
      },
      total: { type: 'number', minimum: 0 },
    },
  },
};

export async function ordersRoutes(app: FastifyInstance) {
  app.get('/orders', async () => {
    return service.getOrders();
  });

  app.get('/orders/:id', async (request) => {
    const { id } = request.params as { id: string };
    const order = service.getOrderById(id);
    if (!order) {
      throw { statusCode: 404, message: 'Order not found' };
    }
    return order;
  });

  app.post('/orders', { schema: createOrderSchema }, async (request) => {
    const input = request.body as CreateOrderInput;
    return service.createOrder(input);
  });

  app.put('/orders/:id', { schema: updateOrderSchema }, async (request) => {
    const { id } = request.params as { id: string };
    const input = request.body as UpdateOrderInput;
    const updated = service.updateOrder(id, input);
    if (!updated) {
      throw { statusCode: 404, message: 'Order not found' };
    }
    return updated;
  });

  app.delete('/orders/:id', async (request) => {
    const { id } = request.params as { id: string };
    const deleted = service.deleteOrder(id);
    if (!deleted) {
      throw { statusCode: 404, message: 'Order not found' };
    }
    return { success: true };
  });
}
