import { describe, it, expect } from 'vitest';
import { createApp } from '../src/app.js';

describe('Order Service App', () => {
  it('should create app with listen method', () => {
    const app = createApp();
    expect(app).toHaveProperty('listen');
    expect(typeof app.listen).toBe('function');
  });
});
