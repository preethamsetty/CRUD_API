// utils/logger.ts

import winston from 'winston';
import path from 'path';

const logger = winston.createLogger({
  level: 'info', // Log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/app.log'), // Log file path
    }),
  ],
});

// Optional: Log errors to a separate file
logger.add(new winston.transports.File({
  filename: path.join(__dirname, '../logs/error.log'),
  level: 'error',
}));

export default logger;
