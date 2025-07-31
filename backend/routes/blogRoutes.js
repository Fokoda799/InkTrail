import { Router } from 'express';
import BlogController from '../controllers/blogController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middlewares/auth.js';
import { createOrUpdateBlogValidator, blogIdValidator, searchBlogsValidator } from '../validators/blogValidator.js';
import { validate } from '../middlewares/validate.js';

// Create a new router
const blogRouter = Router();

// Public routes
blogRouter.get('/', isAuthenticatedUser, BlogController.getAllBlogs);
blogRouter.get('/:id', isAuthenticatedUser, blogIdValidator, validate, BlogController.getBlogById);

// Authenticated user routes
blogRouter.post('/', isAuthenticatedUser, createOrUpdateBlogValidator, validate, BlogController.postBlog);
blogRouter.put('/:id', isAuthenticatedUser, validate, BlogController.updateBlog);
blogRouter.delete('/:id', isAuthenticatedUser, blogIdValidator, validate, BlogController.deleteBlog);
blogRouter.post('/:id/like', isAuthenticatedUser, blogIdValidator, validate, BlogController.likeBlog);

// Admin routes
blogRouter.get('/search', isAuthenticatedUser, BlogController.searchBlogs);

export default blogRouter;
