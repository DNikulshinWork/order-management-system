import type { Order, CreateOrderInput, UpdateOrderInput } from './types.js';

// In-memory storage
const orders = new Map<string, Order>();

export function createOrder(input: CreateOrderInput): Order {
  const order: Order = {
    id: crypto.randomUUID(),
    status: 'pending',
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  orders.set(order.id, order);
  return order;
}

export function getOrders(): Order[] {
  return Array.from(orders.values());
}

export function getOrderById(id: string): Order | null {
  return orders.get(id) || null;
}

export function updateOrder(id: string, input: UpdateOrderInput): Order | null {
  const existing = orders.get(id);
  if (!existing) return null;

  const updated: Order = {
    ...existing,
    ...input,
    updatedAt: new Date(),
  };
  orders.set(id, updated);
  return updated;
}

export function deleteOrder(id: string): boolean {
  return orders.delete(id);
}
