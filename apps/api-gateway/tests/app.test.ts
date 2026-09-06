import 'dotenv/config';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/app/create-app.js';

describe('API Gateway App', () => {
  it('should create app with listen method', () => {
    const app = createApp();
    expect(app).toHaveProperty('listen');
    expect(typeof app.listen).toBe('function');
  });

  it('GET /health should return ok status', async () => {
    const app = createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok', service: 'api-gateway' });
  });

  it('GET /api/notifications should return 503', async () => {
    const app = createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/notifications',
    });
    expect(response.statusCode).toBe(503);
    expect(response.json()).toEqual({
      error: 'Service Unavailable',
      message: 'Service not available',
    });
  });

  it('POST /api/notifications/some/path should return 503', async () => {
    const app = createApp();
    const response = await app.inject({
      method: 'POST',
      url: '/api/notifications/some/path',
    });
    expect(response.statusCode).toBe(503);
    expect(response.json()).toEqual({
      error: 'Service Unavailable',
      message: 'Service not available',
    });
  });

  it('GET /unknown should return 404', async () => {
    const app = createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/unknown',
    });
    expect(response.statusCode).toBe(404);
  });

  it('OPTIONS /api/orders should not crash (proxy is registered)', async () => {
    const app = createApp();
    // The proxy will fail because order-service is not running, but the route should exist
    const response = await app.inject({
      method: 'OPTIONS',
      url: '/api/orders',
    });
    // Should get a response (502 from proxy or 200 from order-service)
    // Since order-service is not running, it will likely be 502 or 500
    expect([500, 502, 503, 504]).toContain(response.statusCode);
  });
});
