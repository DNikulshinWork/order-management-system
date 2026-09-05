/**
 * Базовый класс прикладных ошибок сервиса.
 * Заменяет паттерн `new Error(...) as Error & { statusCode: number }`,
 * который раньше жил прямо в routes.ts.
 */
export class AppError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}
