// app.ts
import express from 'express';
import connectDB from './config/db.config';
import postRoutes from './routes/post.routes';
import dotenv from 'dotenv';
import morganMiddleware from './middlewares/morgon.middleware';
import cors from 'cors';
import helmet from 'helmet';
import { startUserRegistrationConsumer } from './utils/rabbitmqConsumer';  

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Helmet middleware to secure HTTP headers
app.use(helmet());

// Morgan middleware for HTTP logging
app.use(morganMiddleware); // Use the morgan middleware

// Connect to the database
connectDB();

// Start the RabbitMQ consumer
startUserRegistrationConsumer().catch((error) => {
  console.error('Failed to start RabbitMQ consumer:', error);
});

// API routes
app.use('/api/posts', postRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
