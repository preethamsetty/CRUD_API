// middleware/morgan.middleware.ts

import morgan, { StreamOptions } from 'morgan';
import logger from '../utils/logger';

// Stream to use Winston for Morgan logs
const stream: StreamOptions = {
  write: (message) => logger.info(message.trim()), // Use logger.info instead of logger.http
};


// Skip HTTP logging for tests
const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env !== 'development';
};

// Morgan middleware for HTTP logging
const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
);

export default morganMiddleware;
