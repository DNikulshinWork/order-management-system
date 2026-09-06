import { NotificationChannel, NotificationStatus } from '../../shared/enums.js';
import type { FastifyInstance } from 'fastify';
import { NotFoundError } from '../../shared/errors.js';
import * as repository from './repository.js';
import type { CreateNotificationInput, UpdateStatusInput } from './types.js';

const notificationChannelValues = Object.values(NotificationChannel);
const notificationStatusValues = Object.values(NotificationStatus);

const createNotificationSchema = {
  body: {
    type: 'object',
    required: ['recipient', 'type', 'channel', 'content'],
    properties: {
      recipient: { type: 'string', minLength: 1 },
      type: { type: 'string', minLength: 1 },
      channel: { type: 'string', enum: notificationChannelValues },
      content: { type: 'object' },
    },
  },
};

const updateStatusSchema = {
  body: {
    type: 'object',
    required: ['status'],
    properties: {
      status: { type: 'string', enum: notificationStatusValues },
    },
    additionalProperties: false,
  },
};

const getNotificationsQuerySchema = {
  querystring: {
    type: 'object',
    properties: {
      limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
      cursor: { type: 'string', minLength: 1 },
      status: { type: 'string', enum: notificationStatusValues },
    },
    additionalProperties: false,
  },
};

export async function notificationsRoutes(app: FastifyInstance) {
  app.post('/notifications', { schema: createNotificationSchema }, async (request) => {
    const input = request.body as CreateNotificationInput;
    return repository.createNotification(input);
  });

  app.get('/notifications', { schema: getNotificationsQuerySchema }, async (request) => {
    const query = request.query as { limit?: number; cursor?: string; status?: string };
    const limit = query.limit ?? 20;
    const cursor = query.cursor;
    const status = query.status;
    return repository.getNotificationsPaginated(limit, cursor, status);
  });

  app.get('/notifications/:id', async (request) => {
    const { id } = request.params as { id: string };
    const notification = await repository.getNotificationById(id);
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }
    return notification;
  });

  app.patch('/notifications/:id', { schema: updateStatusSchema }, async (request) => {
    const { id } = request.params as { id: string };
    const { status } = request.body as UpdateStatusInput;
    const updated = await repository.updateNotificationStatus(id, status);
    if (!updated) {
      throw new NotFoundError('Notification not found');
    }
    return updated;
  });

  app.delete('/notifications/:id', async (request) => {
    const { id } = request.params as { id: string };
    const deleted = await repository.deleteNotification(id);
    if (!deleted) {
      throw new NotFoundError('Notification not found');
    }
    return { success: true };
  });
}
