import 'dotenv/config';
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { createApp } from '@app/create-app.js';
import { getPrisma, disconnectPrisma } from '@shared/prisma.js';
import type { FastifyInstance } from 'fastify';

describe('Orders API', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    console.log('DATABASE_URL:', process.env.DATABASE_URL || 'NOT SET');
    app = createApp();
    await app.ready();
  });

  beforeEach(async () => {
    await getPrisma().order.deleteMany();
  });

  afterAll(async () => {
    await app.close();
    await disconnectPrisma();
  });

  it('should create an order', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/orders',
      payload: {
        items: [{ productId: 'p1', quantity: 2, price: 100 }],
        total: 200,
      },
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body).toHaveProperty('id');
    expect(body.status).toBe('pending');
    expect(body.total).toBe(200);
  });

  it('should get all orders', async () => {
    await app.inject({
      method: 'POST',
      url: '/orders',
      payload: {
        items: [{ productId: 'p2', quantity: 1, price: 50 }],
        total: 50,
      },
    });

    const response = await app.inject({
      method: 'GET',
      url: '/orders',
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body).toHaveProperty('orders');
    expect(Array.isArray(body.orders)).toBe(true);
    expect(body.orders.length).toBeGreaterThan(0);
  });

  it('should get a single order by id', async () => {
    const createResp = await app.inject({
      method: 'POST',
      url: '/orders',
      payload: {
        items: [{ productId: 'p3', quantity: 3, price: 30 }],
        total: 90,
      },
    });
    const { id } = createResp.json();

    const response = await app.inject({
      method: 'GET',
      url: `/orders/${id}`,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.id).toBe(id);
    expect(body.total).toBe(90);
  });

  it('should update an order', async () => {
    const createResp = await app.inject({
      method: 'POST',
      url: '/orders',
      payload: {
        items: [{ productId: 'p4', quantity: 1, price: 10 }],
        total: 10,
      },
    });
    const { id } = createResp.json();

    const response = await app.inject({
      method: 'PUT',
      url: `/orders/${id}`,
      payload: { status: 'confirmed' },
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.status).toBe('confirmed');
  });

  it('should delete an order', async () => {
    const createResp = await app.inject({
      method: 'POST',
      url: '/orders',
      payload: {
        items: [{ productId: 'p5', quantity: 5, price: 20 }],
        total: 100,
      },
    });
    const { id } = createResp.json();

    const response = await app.inject({
      method: 'DELETE',
      url: `/orders/${id}`,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.success).toBe(true);

    const getResp = await app.inject({
      method: 'GET',
      url: `/orders/${id}`,
    });
    expect(getResp.statusCode).toBe(404);
  });

  it('should return 404 for non-existing order', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/orders/non-existing-id',
    });
    expect(response.statusCode).toBe(404);
    const body = response.json();
    expect(body.message).toBe('Order not found');
  });

  it('should paginate orders with cursor', async () => {
    // Create 25 orders
    const createdIds: string[] = [];
    for (let i = 0; i < 25; i++) {
      const resp = await app.inject({
        method: 'POST',
        url: '/orders',
        payload: {
          items: [{ productId: `p-pag-${i}`, quantity: 1, price: 10 }],
          total: 10,
        },
      });
      createdIds.push(resp.json().id);
    }

    // First page: limit=20
    const page1Resp = await app.inject({
      method: 'GET',
      url: '/orders?limit=20',
    });
    expect(page1Resp.statusCode).toBe(200);
    const page1 = page1Resp.json();
    expect(page1.orders.length).toBe(20);
    expect(page1).toHaveProperty('nextCursor');
    expect(typeof page1.nextCursor).toBe('string');

    // Second page: use cursor from first page
    const page2Resp = await app.inject({
      method: 'GET',
      url: `/orders?limit=20&cursor=${page1.nextCursor}`,
    });
    expect(page2Resp.statusCode).toBe(200);
    const page2 = page2Resp.json();
    expect(page2.orders.length).toBe(5);
    expect(page2).not.toHaveProperty('nextCursor');
  });
});
