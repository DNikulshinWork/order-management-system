import type { FastifyServerOptions } from 'fastify';

/**
 * Fastify из коробки использует pino. Мы не тащим отдельный логгер —
 * просто конфигурируем встроенный: структурированные JSON-логи в проде,
 * человекочитаемый вывод в dev (через pino-pretty, добавь в devDependencies).
 *
 * Поле service — обязательная метка для будущей многосервисной среды:
 * когда появится второй сервис, по логам сразу видно, откуда запись.
 */
// NonNullable обязателен: FastifyServerOptions['logger'] — тип опционального
// свойства, он сам по себе включает `| undefined`, хотя тело функции его
// никогда не возвращает. Без NonNullable компилятор считает результат
// потенциально undefined и падает на exactOptionalPropertyTypes при передаче
// в fastify({ logger: ... }).
export function buildLoggerOptions(): NonNullable<FastifyServerOptions['logger']> {
  const isProduction = process.env.NODE_ENV === 'production';

  const baseOptions = {
    level: process.env.LOG_LEVEL ?? 'info',
    base: { service: 'order-service' },
  };

  // exactOptionalPropertyTypes: true запрещает `transport: undefined` —
  // ключ либо есть с конфигом, либо отсутствует вовсе. Поэтому не пишем
  // тернарник внутри объекта, а решаем на уровне return целиком.
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
