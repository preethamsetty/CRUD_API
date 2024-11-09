import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/post.controller';

const router = express.Router();

// Route to create a new post
router.post('/', createPost);

// Route to get all posts
router.get('/', getPosts);

// Route to get a single post by ID
router.get('/:id', getPostById);

// Route to update a post by ID
router.put('/:id', updatePost);

// Route to delete a post by ID
router.delete('/:id', deletePost);

export default router;
