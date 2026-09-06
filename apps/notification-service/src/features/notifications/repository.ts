import { Prisma, NotificationStatus, Notification } from '../generated/prisma/client/index.js';
import { getPrisma } from '../../shared/prisma.js';
import type { CreateNotificationInput, PaginatedNotificationsResponse } from './types.js';

export async function createNotification(input: CreateNotificationInput): Promise<Notification> {
  const prisma = getPrisma();
  return prisma.notification.create({
    data: {
      recipient: input.recipient,
      type: input.type,
      channel: input.channel,
      content: input.content as Prisma.InputJsonValue,
    },
  });
}

export async function getNotificationsPaginated(
  limit: number,
  cursor?: string,
  status?: NotificationStatus,
): Promise<PaginatedNotificationsResponse> {
  const prisma = getPrisma();
  const take = limit;

  const where = status ? { status } : {};

  const results = await prisma.notification.findMany({
    where,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor } } : {}),
    skip: cursor ? 1 : 0,
  });

  let nextCursor: string | undefined;

  if (results.length > take) {
    const nextItem = results.pop()!;
    nextCursor = nextItem.id;
    return { notifications: results, nextCursor };
  }

  return { notifications: results };
}

export async function getNotificationById(id: string): Promise<Notification | null> {
  const prisma = getPrisma();
  return prisma.notification.findUnique({ where: { id } });
}

export async function updateNotificationStatus(
  id: string,
  status: NotificationStatus,
): Promise<Notification | null> {
  const prisma = getPrisma();
  const existing = await prisma.notification.findUnique({ where: { id } });
  if (!existing) return null;

  return prisma.notification.update({
    where: { id },
    data: { status },
  });
}

export async function deleteNotification(id: string): Promise<boolean> {
  const prisma = getPrisma();
  const existing = await prisma.notification.findUnique({ where: { id } });
  if (!existing) return false;
  await prisma.notification.delete({ where: { id } });
  return true;
}
