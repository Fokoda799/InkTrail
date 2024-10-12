import { Router } from 'express';
import BlogController from '../controllers/blogController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middlewares/auth.js';
import { createOrUpdateBlogValidator, blogIdValidator, searchBlogsValidator } from '../validators/blogValidator.js';
import { validate } from '../middlewares/validate.js';

// Create a new router
const blogRouter = Router();

// Public routes
blogRouter.get('/blogs', isAuthenticatedUser, BlogController.getAllBlogs);
blogRouter.get('/blog/:id', blogIdValidator, validate, BlogController.getBlogById);

// Authenticated user routes
blogRouter.post('/blogs', isAuthenticatedUser, createOrUpdateBlogValidator, validate, BlogController.postBlog);
blogRouter.put('/blog/:id', isAuthenticatedUser, blogIdValidator, createOrUpdateBlogValidator, validate, BlogController.updateBlog);
blogRouter.delete('/blog/:id', isAuthenticatedUser, blogIdValidator, validate, BlogController.deleteBlog);

// Admin routes
blogRouter.get('/blogs/search', isAuthenticatedUser, BlogController.searchBlogs);

export default blogRouter;
