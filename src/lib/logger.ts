/**
 * @file src/lib/logger.ts
 * @description Structured logger — server-side only.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  timestamp: string
  level:     LogLevel
  message:   string
  service:   string
  [key: string]: unknown
}

function writeLog(level: LogLevel, message: string, context?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === 'test') return

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    service: 'parcel-tracker',
    ...context,
  }

  if (level === 'error') {
    console.error(JSON.stringify(entry))
  } else {
    console.log(JSON.stringify(entry))
  }
}

export const logger = {
  info(message: string, context?: Record<string, unknown>): void {
    writeLog('info', message, context)
  },

  warn(message: string, context?: Record<string, unknown>): void {
    writeLog('warn', message, context)
  },

  error(message: string, context?: Record<string, unknown>): void {
    if (context?.err instanceof Error) {
      const { err, ...rest } = context
      writeLog('error', message, {
        ...rest,
        errorMessage: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      })
      return
    }
    writeLog('error', message, context)
  },

  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV !== 'development') return
    writeLog('debug', message, context)
  },
}