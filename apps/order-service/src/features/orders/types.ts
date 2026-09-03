import type { Prisma } from '@prisma/client';

export interface Order {
  id: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: Prisma.JsonValue;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderInput {
  items: Prisma.JsonValue;
  total: number;
}

export interface UpdateOrderInput {
  items?: Prisma.JsonValue;
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total?: number;
}
