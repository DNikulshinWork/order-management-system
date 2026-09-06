import type { Prisma, Order as PrismaOrder } from '@prisma/client';
import { getPrisma } from '../../shared/prisma.js';
import type { CreateOrderInput, UpdateOrderInput, PaginatedOrdersResponse } from './types.js';

export async function createOrder(input: CreateOrderInput): Promise<PrismaOrder> {
  const prisma = getPrisma();
  return prisma.order.create({
    data: {
      items: input.items as Prisma.InputJsonValue,
      total: input.total,
    },
  });
}

export async function getOrdersPaginated(
  limit: number,
  cursor?: string,
): Promise<PaginatedOrdersResponse> {
  const prisma = getPrisma();

  const args: Parameters<typeof prisma.order.findMany>[0] = {
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: limit + 1,
  };

  if (cursor) {
    args.cursor = { id: cursor };
    args.skip = 1;
  }

  const raw = await prisma.order.findMany(args);

  const hasMore = raw.length > limit;
  const orders = hasMore ? raw.slice(0, limit) : raw;
  const nextCursor = hasMore ? orders[orders.length - 1]!.id : undefined;

  const result: PaginatedOrdersResponse = { orders };
  if (nextCursor) {
    result.nextCursor = nextCursor;
  }

  return result;
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

  return prisma.order.update({ where: { id }, data });
}

export async function deleteOrder(id: string): Promise<boolean> {
  const prisma = getPrisma();
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) return false;
  await prisma.order.delete({ where: { id } });
  return true;
}
