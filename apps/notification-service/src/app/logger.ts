import type { FastifyServerOptions } from 'fastify';

/**
 * Fastify из коробки использует pino. Мы не тащим отдельный логгер —
 * просто конфигурируем встроенный: структурированные JSON-логи в проде,
 * человекочитаемый вывод в dev (через pino-pretty, добавь в devDependencies).
 *
 * Поле service — обязательная метка для будущей многосервисной среды.
 */
export function buildLoggerOptions(): NonNullable<FastifyServerOptions['logger']> {
  const isProduction = process.env.NODE_ENV === 'production';

  const baseOptions = {
    level: process.env.LOG_LEVEL ?? 'info',
    base: { service: 'notification-service' },
  };

  if (isProduction) {
    return baseOptions;
  }

  return {
    ...baseOptions,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  };
}
