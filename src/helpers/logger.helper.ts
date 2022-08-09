import { LogLevel } from '@nestjs/common';

export function getLogLevels(level: LogLevel): LogLevel[] {
  const logLevels: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];
  if (logLevels.includes(level)) {
    return logLevels.slice(0, logLevels.indexOf(level) + 1);
  }
  return logLevels;
}
