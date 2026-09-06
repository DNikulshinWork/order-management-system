import 'dotenv/config';
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { createApp } from '@app/create-app.js';
import { getPrisma, disconnectPrisma } from '@shared/prisma.js';
import type { FastifyInstance } from 'fastify';

describe('Notifications API', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    console.log('DATABASE_URL:', process.env.DATABASE_URL || 'NOT SET');
    app = createApp();
    await app.ready();
  });

  beforeEach(async () => {
    await getPrisma().notification.deleteMany();
  });

  afterAll(async () => {
    await app.close();
    await disconnectPrisma();
  });

  it('should create a notification', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/notifications',
      payload: {
        recipient: 'user@example.com',
        type: 'order_confirmation',
        channel: 'email',
        content: { subject: 'Your order is confirmed', body: 'Thank you!' },
      },
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body).toHaveProperty('id');
    expect(body.recipient).toBe('user@example.com');
    expect(body.type).toBe('order_confirmation');
    expect(body.channel).toBe('email');
    expect(body.status).toBe('pending');
  });

  it('should get all notifications', async () => {
    await app.inject({
      method: 'POST',
      url: '/notifications',
      payload: {
        recipient: 'user2@example.com',
        type: 'welcome',
        channel: 'email',
        content: { subject: 'Welcome!', body: 'Hello!' },
      },
    });

    const response = await app.inject({
      method: 'GET',
      url: '/notifications',
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body).toHaveProperty('notifications');
    expect(Array.isArray(body.notifications)).toBe(true);
    expect(body.notifications.length).toBeGreaterThan(0);
  });

  it('should get a single notification by id', async () => {
    const createResp = await app.inject({
      method: 'POST',
      url: '/notifications',
      payload: {
        recipient: 'user3@example.com',
        type: 'reminder',
        channel: 'sms',
        content: { message: "Don't forget!" },
      },
    });
    const { id } = createResp.json();

    const response = await app.inject({
      method: 'GET',
      url: '/notifications/' + id,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.id).toBe(id);
    expect(body.recipient).toBe('user3@example.com');
  });

  it('should update notification status', async () => {
    const createResp = await app.inject({
      method: 'POST',
      url: '/notifications',
      payload: {
        recipient: 'user4@example.com',
        type: 'alert',
        channel: 'push',
        content: { title: 'Alert!', body: 'Something happened' },
      },
    });
    const { id } = createResp.json();

    const response = await app.inject({
      method: 'PATCH',
      url: '/notifications/' + id,
      payload: { status: 'sent' },
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.status).toBe('sent');
  });

  it('should delete a notification', async () => {
    const createResp = await app.inject({
      method: 'POST',
      url: '/notifications',
      payload: {
        recipient: 'user5@example.com',
        type: 'notification',
        channel: 'in_app',
        content: { message: 'Test' },
      },
    });
    const { id } = createResp.json();

    const response = await app.inject({
      method: 'DELETE',
      url: '/notifications/' + id,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.success).toBe(true);

    const getResp = await app.inject({
      method: 'GET',
      url: '/notifications/' + id,
    });
    expect(getResp.statusCode).toBe(404);
  });

  it('should return 404 for non-existing notification', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/notifications/non-existing-id',
    });
    expect(response.statusCode).toBe(404);
    const body = response.json();
    expect(body.message).toBe('Notification not found');
  });

  it('should paginate notifications with cursor', async () => {
    for (let i = 0; i < 25; i++) {
      await app.inject({
        method: 'POST',
        url: '/notifications',
        payload: {
          recipient: 'paginated-user-' + i + '@example.com',
          type: 'bulk',
          channel: 'email',
          content: { subject: 'Message ' + i, body: 'Test' },
        },
      });
    }

    const page1Resp = await app.inject({
      method: 'GET',
      url: '/notifications?limit=20',
    });
    expect(page1Resp.statusCode).toBe(200);
    const page1 = page1Resp.json();
    expect(page1.notifications.length).toBe(20);
    expect(page1).toHaveProperty('nextCursor');
    expect(typeof page1.nextCursor).toBe('string');

    const page2Resp = await app.inject({
      method: 'GET',
      url: '/notifications?limit=20&cursor=' + page1.nextCursor,
    });
    expect(page2Resp.statusCode).toBe(200);
    const page2 = page2Resp.json();
    expect(page2.notifications.length).toBe(5);
    expect(page2).not.toHaveProperty('nextCursor');
  });

  it('should filter notifications by status', async () => {
    await app.inject({
      method: 'POST',
      url: '/notifications',
      payload: {
        recipient: 'filter-test@example.com',
        type: 'test',
        channel: 'email',
        content: { subject: 'Pending', body: 'Test' },
      },
    });

    const createResp = await app.inject({
      method: 'POST',
      url: '/notifications',
      payload: {
        recipient: 'filter-test2@example.com',
        type: 'test',
        channel: 'email',
        content: { subject: 'Sent', body: 'Test' },
      },
    });
    const { id } = createResp.json();

    await app.inject({
      method: 'PATCH',
      url: '/notifications/' + id,
      payload: { status: 'sent' },
    });

    const pendingResp = await app.inject({
      method: 'GET',
      url: '/notifications?status=pending',
    });
    expect(pendingResp.statusCode).toBe(200);
    const pendingBody = pendingResp.json();
    expect(pendingBody.notifications.length).toBe(1);
    expect(pendingBody.notifications[0].status).toBe('pending');

    const sentResp = await app.inject({
      method: 'GET',
      url: '/notifications?status=sent',
    });
    expect(sentResp.statusCode).toBe(200);
    const sentBody = sentResp.json();
    expect(sentBody.notifications.length).toBe(1);
    expect(sentBody.notifications[0].status).toBe('sent');
  });

  it('should return 400 for invalid create payload', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/notifications',
      payload: {
        recipient: 'test@example.com',
      },
    });
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 for invalid status update', async () => {
    const createResp = await app.inject({
      method: 'POST',
      url: '/notifications',
      payload: {
        recipient: 'test@example.com',
        type: 'test',
        channel: 'email',
        content: { message: 'Test' },
      },
    });
    const { id } = createResp.json();

    const response = await app.inject({
      method: 'PATCH',
      url: '/notifications/' + id,
      payload: { status: 'invalid_status' },
    });
    expect(response.statusCode).toBe(400);
  });
});
