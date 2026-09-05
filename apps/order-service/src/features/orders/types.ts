import type { Prisma, Order as PrismaOrder, OrderStatus } from '@prisma/client';

// Единственный источник правды по статусам — enum из schema.prisma.
// Ручного union-типа больше нет: он неизбежно расходился бы с БД при первом же
// изменении enum. Тип и рантайм-значения (см. routes.ts) теперь берутся из
// сгенерированного Prisma Client.
export type { OrderStatus };

export type Order = PrismaOrder;

export interface CreateOrderInput {
  items: Prisma.InputJsonValue;
  total: number;
}

export interface UpdateOrderInput {
  items?: Prisma.InputJsonValue;
  status?: OrderStatus;
  total?: number;
}
