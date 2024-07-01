import Boom from '@hapi/boom';
import { ILogger } from './interfaces';

const environmentList = ['production', 'dev'];

const createLoggerHandler = (title: string): ILogger => {
  function logInfo(message: string, options?: Record<string, unknown>): void {
    if (environmentList.includes(process.env.NODE_ENV || '')) {
      const logOptions = {
        discord: options?.discord || false,
        level: options?.level || 'info',
        ...options,
        message: `${title} - ${message}`,
        labels: options && options.labels ? { ...options.labels } : { message },
      };

      console.info(logOptions);
    }
  }

  function logError(message: string, error?: Error | Boom.Boom): void {
    if (environmentList.includes(process.env.NODE_ENV || '')) {
      if (!error) {
        console.error({
          error,
          message: 'Unknown error',
          labels: { message },
        });
      } else if ('isBoom' in error && error.isBoom) {
        const boomError = error as Boom.Boom;
        console.error({
          error,
          message: boomError.message,
          labels: {
            statusCode: boomError.output.statusCode,
            message: boomError.output.payload.message,
          },
        });
      } else {
        console.error({
          error,
          message: error.message || 'Unknown error',
          labels: { message },
        });
      }
    }
  }

  return { logInfo, logError };
};

export default createLoggerHandler;
