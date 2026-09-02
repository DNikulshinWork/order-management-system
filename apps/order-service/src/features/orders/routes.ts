import type { FastifyInstance } from 'fastify';
import * as service from './service.js';
import type { CreateOrderInput, UpdateOrderInput } from './types.js';

export async function ordersRoutes(app: FastifyInstance) {
  // GET /orders
  app.get('/orders', async () => {
    return service.getOrders();
  });

  // GET /orders/:id
  app.get('/orders/:id', async (request) => {
    const { id } = request.params as { id: string };
    const order = service.getOrderById(id);
    if (!order) {
      throw { statusCode: 404, message: 'Order not found' };
    }
    return order;
  });

  // POST /orders
  app.post('/orders', async (request) => {
    const input = request.body as CreateOrderInput;
    return service.createOrder(input);
  });

  // PUT /orders/:id
  app.put('/orders/:id', async (request) => {
    const { id } = request.params as { id: string };
    const input = request.body as UpdateOrderInput;
    const updated = service.updateOrder(id, input);
    if (!updated) {
      throw { statusCode: 404, message: 'Order not found' };
    }
    return updated;
  });

  // DELETE /orders/:id
  app.delete('/orders/:id', async (request) => {
    const { id } = request.params as { id: string };
    const deleted = service.deleteOrder(id);
    if (!deleted) {
      throw { statusCode: 404, message: 'Order not found' };
    }
    return { success: true };
  });
}
