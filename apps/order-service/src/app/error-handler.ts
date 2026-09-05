import type { FastifyError, FastifyInstance } from 'fastify';
import { AppError } from '../shared/errors.js';

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error, request, reply) => {
    // Наши доменные ошибки (NotFoundError и т.д.)
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ error: error.name, message: error.message });
    }

    // Валидационные ошибки Fastify (JSON Schema)
    const fastifyError = error as FastifyError;
    if (fastifyError.validation) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: error.message,
        details: fastifyError.validation,
      });
    }

    // Всё остальное — логируем полностью (со стеком), наружу отдаём безопасное сообщение
    request.log.error({ err: error }, 'Unhandled error');
    const statusCode = fastifyError.statusCode ?? 500;
    return reply.status(statusCode).send({
      error: error.name || 'Internal Server Error',
      message: statusCode === 500 ? 'Something went wrong' : error.message,
    });
  });
}
