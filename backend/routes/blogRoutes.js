import { Router } from 'express';
import BlogController from '../controllers/blogController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middlewares/auth.js';

// Create a new router
const blogRouter = Router();

// Public routes
blogRouter.get('/blogs', BlogController.getAllBlogs);
blogRouter.get('/blogs/:id', BlogController.getBlogById);

// Authenticated user routes
blogRouter.post('/blogs', isAuthenticatedUser, BlogController.postBlog);
blogRouter.put('/blogs/:id', isAuthenticatedUser, BlogController.updateBlog);
blogRouter.delete('/blogs/:id', isAuthenticatedUser, BlogController.deleteBlog);
blogRouter.get('/user/me/blogs', isAuthenticatedUser, BlogController.getAuthUserBlogs);
blogRouter.get('/user/me/blogs/:id', isAuthenticatedUser, BlogController.getAuthUserBlogById);

// Admin routes
blogRouter.post('/admin/blogs', isAuthenticatedUser, authorizeRoles('admin'), BlogController.postBlogAsAdmin);
blogRouter.get('/admin/users/:id/blogs', isAuthenticatedUser, authorizeRoles('admin'), BlogController.getUserBlogs);
blogRouter.get('/admin/users/:userId/blogs/:id', isAuthenticatedUser, authorizeRoles('admin'), BlogController.getUserBlogById);

export default blogRouter;
