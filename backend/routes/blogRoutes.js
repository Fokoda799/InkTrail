import { Router } from 'express';
import BlogController from '../controllers/blogController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middlewares/auth.js';
import { createOrUpdateBlogValidator, blogIdValidator } from '../validators/blogValidator.js';
import { validate } from '../middlewares/validate.js'; // A middleware to handle validation errors

// Create a new router
const blogRouter = Router();

// Public routes
blogRouter.get('/blogs', BlogController.getAllBlogs);
blogRouter.get('/blogs/:id', blogIdValidator, validate, BlogController.getBlogById);

// Authenticated user routes
blogRouter.post('/blogs', isAuthenticatedUser, createOrUpdateBlogValidator, validate, BlogController.postBlog);
blogRouter.put('/blogs/:id', isAuthenticatedUser, blogIdValidator, createOrUpdateBlogValidator, validate, BlogController.updateBlog);
blogRouter.delete('/blogs/:id', isAuthenticatedUser, blogIdValidator, validate, BlogController.deleteBlog);
blogRouter.get('/user/me/blogs', isAuthenticatedUser, BlogController.getUserBlogs);
blogRouter.get('/user/me/blogs/:id', isAuthenticatedUser, blogIdValidator, validate, BlogController.getUserBlogById);

// Admin routes
blogRouter.post('/admin/blogs', isAuthenticatedUser, authorizeRoles('admin'), createOrUpdateBlogValidator, validate, BlogController.postBlogAsAdmin);
blogRouter.get('/admin/users/:id/blogs', isAuthenticatedUser, authorizeRoles('admin'), BlogController.getUserBlogs);
blogRouter.get('/admin/users/:userId/blogs/:id', isAuthenticatedUser, authorizeRoles('admin'), blogIdValidator, validate, BlogController.getUserBlogById);
blogRouter.put('/blogs/like/:id', isAuthenticatedUser, BlogController.likeBlog);

export default blogRouter;
