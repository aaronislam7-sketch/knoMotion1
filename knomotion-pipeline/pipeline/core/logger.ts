/** Minimal structured, leveled logger. Scoped per jobId/stage. */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

export interface Logger {
  readonly level: LogLevel;
  child(scope: Record<string, unknown>): Logger;
  debug(msg: string, data?: Record<string, unknown>): void;
  info(msg: string, data?: Record<string, unknown>): void;
  warn(msg: string, data?: Record<string, unknown>): void;
  error(msg: string, data?: Record<string, unknown>): void;
}

class ConsoleLogger implements Logger {
  constructor(
    public readonly level: LogLevel = 'info',
    private readonly scope: Record<string, unknown> = {},
  ) {}

  child(scope: Record<string, unknown>): Logger {
    return new ConsoleLogger(this.level, { ...this.scope, ...scope });
  }

  private log(level: LogLevel, msg: string, data?: Record<string, unknown>): void {
    if (LEVEL_ORDER[level] < LEVEL_ORDER[this.level]) return;
    const prefix = `[${new Date().toISOString()}] ${level.toUpperCase()}`;
    const scopeStr = Object.keys(this.scope).length
      ? ' ' + Object.entries(this.scope).map(([k, v]) => `${k}=${v}`).join(' ')
      : '';
    const line = `${prefix}${scopeStr} ${msg}`;
    const sink = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    if (data && Object.keys(data).length) sink(line, data);
    else sink(line);
  }

  debug(msg: string, data?: Record<string, unknown>) { this.log('debug', msg, data); }
  info(msg: string, data?: Record<string, unknown>) { this.log('info', msg, data); }
  warn(msg: string, data?: Record<string, unknown>) { this.log('warn', msg, data); }
  error(msg: string, data?: Record<string, unknown>) { this.log('error', msg, data); }
}

export const createLogger = (level: LogLevel = 'info', scope: Record<string, unknown> = {}): Logger =>
  new ConsoleLogger(level, scope);
