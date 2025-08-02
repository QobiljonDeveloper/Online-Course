import { Injectable, NestMiddleware } from "@nestjs/common";
import * as winston from "winston";
import { Request, Response, NextFunction } from "express";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger: winston.Logger;

  constructor() {
    const logDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: path.join(logDir, "requests.log"),
        }),
      ],
    });
  }

  use(req: Request, res: Response, next: NextFunction): void {
    res.on("finish", () => {
      this.logger.info({
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        timestamp: new Date().toISOString(),
      });
    });

    next();
  }
}
