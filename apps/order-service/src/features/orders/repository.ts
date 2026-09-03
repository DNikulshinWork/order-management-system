import type { Prisma, Order as PrismaOrder } from '@prisma/client';
import { getPrisma } from '../../shared/prisma.js';
import type { CreateOrderInput, UpdateOrderInput } from './types.js';

export async function createOrder(input: CreateOrderInput): Promise<PrismaOrder> {
  const prisma = getPrisma();
  return prisma.order.create({
    data: {
      items: input.items as Prisma.InputJsonValue,
      total: input.total,
    },
  });
}

export async function getOrders(): Promise<PrismaOrder[]> {
  const prisma = getPrisma();
  return prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getOrderById(id: string): Promise<PrismaOrder | null> {
  const prisma = getPrisma();
  return prisma.order.findUnique({ where: { id } });
}

export async function updateOrder(
  id: string,
  input: UpdateOrderInput,
): Promise<PrismaOrder | null> {
  const prisma = getPrisma();
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) return null;

  const data: Prisma.OrderUpdateInput = {};
  if (input.status !== undefined) data.status = input.status;
  if (input.items !== undefined) data.items = input.items as Prisma.InputJsonValue;
  if (input.total !== undefined) data.total = input.total;

  return prisma.order.update({
    where: { id },
    data,
  });
}

export async function deleteOrder(id: string): Promise<boolean> {
  const prisma = getPrisma();
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) return false;
  await prisma.order.delete({ where: { id } });
  return true;
}
