import { OrderStatus } from '../../shared/enums.js';
import type { FastifyInstance } from 'fastify';
import { NotFoundError } from '../../shared/errors.js';
import * as repository from './repository.js';
import type { CreateOrderInput, UpdateOrderInput } from './types.js';

const orderStatusValues = Object.values(OrderStatus);

const orderItemSchema = {
  type: 'object',
  required: ['productId', 'quantity', 'price'],
  properties: {
    productId: { type: 'string', minLength: 1 },
    quantity: { type: 'number', minimum: 1 },
    price: { type: 'number', minimum: 0 },
  },
} as const;

const createOrderSchema = {
  body: {
    type: 'object',
    required: ['items', 'total'],
    properties: {
      items: {
        type: 'array',
        minItems: 1,
        items: orderItemSchema,
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
      status: { type: 'string', enum: orderStatusValues },
      items: {
        type: 'array',
        minItems: 1,
        items: orderItemSchema,
      },
      total: { type: 'number', minimum: 0 },
    },
  },
};

const getOrdersQuerySchema = {
  querystring: {
    type: 'object',
    properties: {
      limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
      cursor: { type: 'string', minLength: 1 },
    },
    additionalProperties: false,
  },
};

export async function ordersRoutes(app: FastifyInstance) {
  app.get('/orders', { schema: getOrdersQuerySchema }, async (request) => {
    const query = request.query as { limit?: number; cursor?: string };
    const limit = query.limit ?? 20;
    const cursor = query.cursor;
    return repository.getOrdersPaginated(limit, cursor);
  });

  app.get('/orders/:id', async (request) => {
    const { id } = request.params as { id: string };
    const order = await repository.getOrderById(id);
    if (!order) {
      throw new NotFoundError('Order not found');
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
      throw new NotFoundError('Order not found');
    }
    return updated;
  });

  app.delete('/orders/:id', async (request) => {
    const { id } = request.params as { id: string };
    const deleted = await repository.deleteOrder(id);
    if (!deleted) {
      throw new NotFoundError('Order not found');
    }
    return { success: true };
  });
}
