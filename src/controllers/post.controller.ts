// controllers/post.controller.ts

import { Request, Response } from 'express';
import Post from '../models/posts';
import logger from '../utils/logger'; // Import the logger
import redisClient from '../utils/redisClient';

// Create a new post
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = new Post(req.body);
    const savedPost = await post.save();
    logger.info(`Post created: ${JSON.stringify(savedPost)}`);
    await redisClient.del('posts'); // Clear posts cache
    res.status(201).json(savedPost);
  } catch (error) {
    logger.error('Error creating post');
    res.status(400).json({ message: 'Error creating post' });
  }
};

// Get all posts
export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Attempt to retrieve from Redis cache first
    const cache = await redisClient.get('posts');
    if (cache) {
      logger.info('Retrieved posts from Redis cache');
      res.status(200).json(JSON.parse(cache)); // Response if cache hit
      return; // Stop further execution after response
    }

    // If cache miss, retrieve from MongoDB and cache it
    const posts = await Post.find();
    await redisClient.setEx('posts', 3600, JSON.stringify(posts)); // Cache posts for 1 hour
    logger.info(`Retrieved ${posts.length} posts`);
    res.status(200).json(posts); // Response if cache miss
  } catch (error) {
    logger.error('Error retrieving posts');
    res.status(500).json({ message: 'Server Error' }); // Error response
  }
};

// Get a single post by ID
export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Attempt to retrieve post from Redis cache first
    const cache = await redisClient.get(`post:${id}`);
    if (cache) {
      logger.info(`Retrieved post ${id} from Redis cache`);
      res.status(200).json(JSON.parse(cache)); // Response if cache hit
      return; // Stop further execution after response
    }

    // If cache miss, retrieve from MongoDB
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' }); // Response if post not found
      return; // Stop further execution after response
    }

    // Cache the retrieved post for future requests
    await redisClient.setEx(`post:${id}`, 3600, JSON.stringify(post)); // Cache post for 1 hour
    logger.info(`Retrieved post with ID: ${id}`);
    res.status(200).json(post); // Response if post found in database
  } catch (error) {
    logger.error('Error retrieving post');
    res.status(500).json({ message: 'Server Error' }); // Error response
  }
};


// Update a post by ID
export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPost) {
      logger.warn(`Post not found for update with ID: ${req.params.id}`); // Log warning if post not found
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    logger.info(`Updated post with ID: ${req.params.id}`); // Log updated post
    res.status(200).json(updatedPost);
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Error updating post with ID: ${req.params.id}. Error: ${error.message}`); // Log error details
      res.status(500).json({ message: 'Server Error', error: error.message });
    } else {
      logger.error('An unknown error occurred while updating a post.');
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// Delete a post by ID
export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      logger.warn(`Post not found for deletion with ID: ${req.params.id}`); // Log warning if post not found
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    logger.info(`Deleted post with ID: ${req.params.id}`); // Log deleted post
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Error deleting post with ID: ${req.params.id}. Error: ${error.message}`); // Log error details
      res.status(500).json({ message: 'Server Error', error: error.message });
    } else {
      logger.error('An unknown error occurred while deleting a post.');
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
