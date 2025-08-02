import * as winston from "winston";
import { utilities as nestWinstonModuleUtilities } from "nest-winston";

const logDir = "logs";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike("NestJS", {
          prettyPrint: true,
        })
      ),
    }),
    new winston.transports.File({
      filename: `${logDir}/error.log`,
      level: "error",
    }),
    new winston.transports.File({ filename: `${logDir}/combined.log` }),
    new winston.transports.File({
      filename: `${logDir}/requests.log`,
      level: "info",
    }),
  ],
});
