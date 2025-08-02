import * as winston from "winston";

export function ErrorLoggerMiddleware(
  err: any,
  req: any,
  res: any,
  next: (error?: any) => void
) {
  const logger = winston.createLogger({
    level: "error",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "logs/errors.log" }),
    ],
  });

  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString(),
  });

  next(err);
}
