import { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Custom log format for console
const consoleFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.colorize(),
  format.printf(({ timestamp, level, message, context, trace }) => {
    return `${timestamp} [${level}] ${context ? `[${context}] ` : ''}${message}${trace ? `\n${trace}` : ''}`;
  }),
);

// Format for file logs
const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message, context, trace }) => {
    return `${timestamp} [${level}] ${context ? `[${context}] ` : ''}${message}${trace ? `\n${trace}` : ''}`;
  }),
);

export const winstonConfig = {
  transports: [
    // Console transport
    new transports.Console({
      format: consoleFormat,
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    }),
    // Error logs
    new DailyRotateFile({
      format: fileFormat,
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
    }),
    // All logs
    new DailyRotateFile({
      format: fileFormat,
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
};
