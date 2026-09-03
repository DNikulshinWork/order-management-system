import { PrismaClient } from '../generated/prisma/client.js';
import type { Order, CreateOrderInput, UpdateOrderInput } from './types.js';

const prisma = new PrismaClient();

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const order = await prisma.order.create({
    data: {
      items: input.items,
      total: input.total,
    },
  });
  return {
    id: order.id,
    status: order.status,
    items: order.items as any,
    total: order.total,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

export async function getOrders(): Promise<Order[]> {
  const orders = await prisma.order.findMany();
  return orders.map(o => ({
    id: o.id,
    status: o.status,
    items: o.items as any,
    total: o.total,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  }));
}

export async function getOrderById(id: string): Promise<Order | null> {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return null;
  return {
    id: order.id,
    status: order.status,
    items: order.items as any,
    total: order.total,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

export async function updateOrder(id: string, input: UpdateOrderInput): Promise<Order | null> {
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) return null;
  const updated = await prisma.order.update({
    where: { id },
    data: {
      status: input.status,
      items: input.items,
      total: input.total,
    },
  });
  return {
    id: updated.id,
    status: updated.status,
    items: updated.items as any,
    total: updated.total,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
}

export async function deleteOrder(id: string): Promise<boolean> {
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) return false;
  await prisma.order.delete({ where: { id } });
  return true;
}
