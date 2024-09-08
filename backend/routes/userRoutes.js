import { Router } from 'express';
import UserController from '../controllers/userController.js';
import AuthController from '../controllers/authController.js';
import BlogController from '../controllers/blogController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middlewares/auth.js';

// Create a new router
const userRouter = Router();

// Define user routes
userRouter.get('/', authorizeRoles('admin'), UserController.getAllUsers);
userRouter.get('/user/:id', authorizeRoles('admin'), UserController.getUserById);
userRouter.post('/', UserController.createUser);
userRouter.put('/user/:id', authorizeRoles('admin'), UserController.updateUser);
userRouter.delete('/user/:id', authorizeRoles('admin'), UserController.deleteUser);

// Define auth routes
userRouter.get('/login', AuthController.connectUser);
userRouter.get('/me', isAuthenticatedUser, UserController.getMe);
userRouter.get('/logout', AuthController.disconnectUser);

// Get user blogs
userRouter.get('/user/:id/blogs', BlogController.getUserBlogs);
userRouter.get('/me/blogs/:id', BlogController.getMyBlogs);

export default userRouter;
