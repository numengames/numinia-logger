import Boom from '@hapi/boom';
import { ILogger } from './interfaces';

const environmentList = ['production', 'dev'];

export default (title: string): ILogger => {
  function logInfo(message: string, options?: Record<string, unknown>): void {
    if (environmentList.includes(process.env.NODE_ENV || '')) {
      console.info({
        ...options,
        message: `${title} - ${message}`,
        labels: options && options.labels ? { ...options.labels } : { message },
      });
    }
  }
  
  function logError(message: string, error?: Error | Boom.Boom): void {
    if (environmentList.includes(process.env.NODE_ENV || '')) {
      if (!error) {
        console.error({
          error: 'Unknown error',
          labels: { message }
        });
      } else if ('isBoom' in error && error.isBoom) {
        const boomError = error as Boom.Boom;
        console.error({
          error: boomError.message,
          labels: {
            statusCode: boomError.output.statusCode,
            message: boomError.output.payload.message
          }
        });
      } else {
        console.error({
          error: error.message || 'Unknown error',
          labels: { message }
        });
      }
    }
  }
  
  return { logInfo, logError };
};
