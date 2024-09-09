import { Router } from 'express';
import BlogController from '../controllers/blogController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middlewares/auth.js';

// Create a new router
const blogRouter = Router();

// Define blog routes
blogRouter.get('/blogs', BlogController.getAllBlogs);
blogRouter.get('/blogs/:id', BlogController.getBlogById);
blogRouter.post('/blogs', isAuthenticatedUser, BlogController.postBlog);
blogRouter.post('/admin/blogs', isAuthenticatedUser, authorizeRoles("admin"), BlogController.postBlogAsAdmin);
blogRouter.put('/blogs/:id', isAuthenticatedUser, BlogController.updateBlog);
blogRouter.delete('/blogs/:id', isAuthenticatedUser, BlogController.deleteBlog);

// Get blogs for users
blogRouter.get('/admin/:id/blogs', isAuthenticatedUser, authorizeRoles("admin"), BlogController.getUserBlogs);
blogRouter.get('/admin/:userId/blogs/:id', isAuthenticatedUser, authorizeRoles("admin"), BlogController.getUserBlogs);

// Get blogs for auth users
blogRouter.get('/user/me/blogs', isAuthenticatedUser, BlogController.getAuthUserBlogs);
blogRouter.get('/user/me/blogs/:id', isAuthenticatedUser, BlogController.getAuthUserBlogById);

export default blogRouter;
