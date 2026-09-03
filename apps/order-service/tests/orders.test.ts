import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createApp } from '../src/app.js';
import type { FastifyInstance } from 'fastify';

describe('Orders API', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    console.log('DATABASE_URL:', process.env.DATABASE_URL || 'NOT SET');
    app = createApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
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
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
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
});
