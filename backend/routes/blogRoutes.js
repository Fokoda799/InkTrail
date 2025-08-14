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
blogRouter.post('/:id/action', isAuthenticatedUser, blogIdValidator, validate, BlogController.BlogActions);
blogRouter.get('/:id/comments', isAuthenticatedUser, blogIdValidator, validate, BlogController.getBlogComments);
blogRouter.get('/:id/comments/count', isAuthenticatedUser, blogIdValidator, validate, BlogController.commentCount);
blogRouter.post('/:id/comments', isAuthenticatedUser, blogIdValidator, validate, BlogController.addComment);
blogRouter.put('/comments/:id', isAuthenticatedUser, blogIdValidator, validate, BlogController.updateComment);
blogRouter.delete('/comments/:id', isAuthenticatedUser, blogIdValidator, validate, BlogController.deleteComment);
blogRouter.post('/comments/:id/like', isAuthenticatedUser, blogIdValidator, validate, BlogController.toggleCommentLike);
blogRouter.get('/user/:username', isAuthenticatedUser, BlogController.getUserBlogs);

// Admin routes
blogRouter.get('/search', isAuthenticatedUser, BlogController.searchBlogs);

export default blogRouter;
