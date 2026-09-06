import type {
  Prisma,
  NotificationStatus,
  Notification as PrismaNotification,
} from '@prisma/client';
import { getPrisma } from '../../shared/prisma.js';
import type {
  CreateNotificationInput,
  UpdateStatusInput,
  PaginatedNotificationsResponse,
} from './types.js';

export async function createNotification(
  input: CreateNotificationInput,
): Promise<PrismaNotification> {
  const prisma = getPrisma();
  return prisma.Notification.create({
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

  const where: Prisma.NotificationWhereInput = {};
  if (status) {
    where.status = status;
  }

  const args: Prisma.NotificationFindManyArgs = {
    where,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: limit + 1,
  };

  if (cursor) {
    args.cursor = { id: cursor };
    args.skip = 1;
  }

  const raw = await prisma.Notification.findMany(args);

  const hasMore = raw.length > limit;
  const notifications = hasMore ? raw.slice(0, limit) : raw;
  const nextCursor = hasMore ? notifications[notifications.length - 1]!.id : undefined;

  const result: PaginatedNotificationsResponse = { notifications };
  if (nextCursor) {
    result.nextCursor = nextCursor;
  }

  return result;
}

export async function getNotificationById(id: string): Promise<PrismaNotification | null> {
  const prisma = getPrisma();
  return prisma.Notification.findUnique({ where: { id } });
}

export async function updateNotificationStatus(
  id: string,
  input: UpdateStatusInput,
): Promise<PrismaNotification | null> {
  const prisma = getPrisma();
  const existing = await prisma.Notification.findUnique({ where: { id } });
  if (!existing) return null;

  return prisma.Notification.update({
    where: { id },
    data: { status: input.status },
  });
}

export async function deleteNotification(id: string): Promise<boolean> {
  const prisma = getPrisma();
  const existing = await prisma.Notification.findUnique({ where: { id } });
  if (!existing) return false;
  await prisma.Notification.delete({ where: { id } });
  return true;
}
