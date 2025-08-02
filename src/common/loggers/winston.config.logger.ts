import { utilities as nestWinstonModuleUtilities } from "nest-winston";
import * as winston from "winston";

export const WinstonLoggerConfig = {
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
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
};
