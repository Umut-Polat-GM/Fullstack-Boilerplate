import { env } from "#config/env.js";
import { logger } from "#lib/logger.js";
import { ApiError } from "#utils/ApiError.js";

export function notFound(req, _res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// Express recognises error handlers by their 4 arguments — keep `_next`.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  // Malformed JSON body sent by the client
  if (err.type === "entity.parse.failed") {
    err = ApiError.badRequest("Malformed JSON body");
  }

  const statusCode = err instanceof ApiError ? err.statusCode : (err.status ?? 500);
  const isServerError = statusCode >= 500;

  if (isServerError) logger.error(err);

  res.status(statusCode).json({
    success: false,
    message: isServerError && env.isProduction ? "Internal server error" : err.message,
    ...(err.details && { errors: err.details }),
    ...(!env.isProduction && isServerError && { stack: err.stack }),
  });
}
