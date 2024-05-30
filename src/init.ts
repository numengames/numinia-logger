import LokiTransport from 'winston-loki';
import morgan, { StreamOptions } from 'morgan';
import TransportStream from 'winston-transport';
import DiscordTransport from 'winston-discord-transport';
import { createLogger, format, Logger, transports } from 'winston';
import { NextFunction, Request, Response, Application } from 'express';

import { TLoggerConfig } from './types';

const { combine, prettyPrint } = format;

const ignoreMessageList = (ignoreList: Array<string>) =>
  format((info) =>
    ignoreList.some((item) => JSON.stringify(info).includes(item))
      ? false
      : info,
  )();

export default class InitLogger {
  private logger: Logger;

  constructor(config: TLoggerConfig) {
    this.logger = this.initializeLogger(config);
  }

  private initializeLogger = ({ loki, discord }: TLoggerConfig): Logger => {
    const transportList: TransportStream[] = [
      new transports.Console({
        silent: process.env.LOG !== '1',
        format: combine(
          format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
          format.colorize({ all: true }),
          format.printf(({ level, message, timestamp, stack }) => {
            if (stack) {
              return `${timestamp} ${level}: ${message} - ${stack}`;
            }
            return `${timestamp} ${level}: ${message}`;
          }),
        ),
      }),
    ];

    if (process.env.NODE_ENV === 'production') {
      transportList.push(
        new LokiTransport({
          format: combine(
            ignoreMessageList(['monit/health']),
            prettyPrint(),
            format.colorize({ all: true }),
          ),
          host: loki.host,
          silent: !loki.isActive,
          labels: { job: loki.job },
          basicAuth: `${loki.user}:${loki.password}`,
        }),
      );

      if (discord?.isActive) {
        transportList.push(
          new DiscordTransport({
            level: 'info',
            webhook: discord.webhook,
            defaultMeta: { service: discord.service },
          }),
        );
      }
    }

    return createLogger({
      exitOnError: false,
      transports: transportList,
      format: combine(format.errors({ stack: true })),
    });
  };

  initLogger() {
    console.log = (args) => this.logger.info.call(this.logger, args);
    console.info = (args) => this.logger.info.call(this.logger, args);
    console.warn = (args) => this.logger.warn.call(this.logger, args);
    console.error = (args) => this.logger.error.call(this.logger, args);
    console.debug = (args) => this.logger.debug.call(this.logger, args);
  }

  initExpressLogger(app: Application) {
    const morganOptions: StreamOptions = {
      write: (message: string) => {
        this.logger.info({
          discord: false,
          message: message.trim(),
          labels: { message: message.trim() },
        });
      },
    };

    app.use(morgan('tiny', { stream: morganOptions }));

    const setupMiddleware = (
      _req: Request,
      _res: Response,
      next: NextFunction,
    ) => {
      this.initLogger();
      next();
    };

    app.use(setupMiddleware);
  }
}
