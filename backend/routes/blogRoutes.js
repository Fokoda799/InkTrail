import { Router } from 'express';
import BlogController from '../controllers/blogController.js';

// Create a new router
const blogRouter = Router();

// Define blog routes
blogRouter.get('/', BlogController.getAllBlogs);
blogRouter.get('/:id', BlogController.getBlogById);
blogRouter.post('/', BlogController.postBlog);
blogRouter.put('/:id', BlogController.updateBlog);
blogRouter.delete('/:id', BlogController.deleteBlog);

export default blogRouter;
