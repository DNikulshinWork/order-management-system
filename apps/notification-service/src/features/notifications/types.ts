import type {
  Prisma,
  Notification as PrismaNotification,
  NotificationStatus,
  NotificationChannel,
} from '@generated/prisma/client';

export type Notification = PrismaNotification;
export type { NotificationStatus, NotificationChannel };

export interface CreateNotificationInput {
  recipient: string;
  type: string;
  channel: NotificationChannel;
  content: Prisma.InputJsonValue;
}

export interface UpdateStatusInput {
  status: NotificationStatus;
}

export interface PaginatedNotificationsResponse {
  notifications: Notification[];
  nextCursor?: string;
}
