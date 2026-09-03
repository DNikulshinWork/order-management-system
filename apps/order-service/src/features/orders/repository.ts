import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import type { Prisma, Order as PrismaOrder } from '@prisma/client';
import type { CreateOrderInput, UpdateOrderInput } from './types.js';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function createOrder(input: CreateOrderInput): Promise<PrismaOrder> {
  const order = await prisma.order.create({
    data: {
      items: input.items as Prisma.InputJsonValue,
      total: input.total,
    },
  });
  return order;
}

export async function getOrders(): Promise<PrismaOrder[]> {
  return prisma.order.findMany();
}

export async function getOrderById(id: string): Promise<PrismaOrder | null> {
  return prisma.order.findUnique({ where: { id } });
}

export async function updateOrder(
  id: string,
  input: UpdateOrderInput,
): Promise<PrismaOrder | null> {
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
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) return false;
  await prisma.order.delete({ where: { id } });
  return true;
}
