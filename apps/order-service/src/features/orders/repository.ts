import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import type { CreateOrderInput, UpdateOrderInput } from './types.js';

const prisma = new PrismaClient();

export async function createOrder(input: CreateOrderInput) {
  const order = await prisma.order.create({
    data: {
      items: input.items as Prisma.JsonValue,
      total: input.total,
    },
  });
  return order;
}

export async function getOrders() {
  return prisma.order.findMany();
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({ where: { id } });
}

export async function updateOrder(id: string, input: UpdateOrderInput) {
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) return null;

  const data: Prisma.OrderUpdateInput = {};
  if (input.status !== undefined) data.status = input.status;
  if (input.items !== undefined) data.items = input.items as Prisma.JsonValue;
  if (input.total !== undefined) data.total = input.total;

  return prisma.order.update({
    where: { id },
    data,
  });
}

export async function deleteOrder(id: string) {
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) return false;
  await prisma.order.delete({ where: { id } });
  return true;
}
