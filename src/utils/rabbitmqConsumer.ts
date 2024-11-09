import amqplib from 'amqplib';
import { createChannel } from '../utils/rabbitmqClient';

const queueName = 'user_registration_queue';

export async function startUserRegistrationConsumer() {
  try {
    const connection = await amqplib.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, { durable: true });
    console.log(`Waiting for messages in queue: ${queueName}`);

    // Consume messages from the queue
    channel.consume(queueName, (message) => {
      if (message) {
        const userData = JSON.parse(message.content.toString());
        console.log('Received user registration message:', userData);

        // Process the user registration message
        processUserRegistration(userData);

        // Acknowledge message after processing
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error('Error in RabbitMQ consumer:', error);
  }
}

// Function to handle processing of the received message
function processUserRegistration(userData: any) {
  console.log('Processing user registration for:', userData.email);
  // Additional logic to handle user registration data can go here
}
