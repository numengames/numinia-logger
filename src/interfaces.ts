import Boom from '@hapi/boom';

export interface ILogger {
  logError: (message: string, error?: Error|Boom.Boom) => void
  logInfo: (message: string, labels?: Record<string, unknown>) => void
}