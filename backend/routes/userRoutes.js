import { Router } from 'express';
import UserController from '../controllers/userController.js';
import AuthController from '../controllers/authController.js';
import BlogController from '../controllers/blogController.js';

// Create a new router
const userRouter = Router();

// Define user routes
userRouter.get('/', UserController.getAllUsers);
userRouter.get('/:id', UserController.getUserById);
userRouter.post('/', UserController.createUser);
userRouter.put('/:id', UserController.updateUser);
userRouter.delete('/:id', UserController.deleteUser);

// Define auth routes
userRouter.get('/login', AuthController.connectUser);
userRouter.get('/me', UserController.getMe);
userRouter.get('/logout', AuthController.disconnectUser);

// Get user blogs
userRouter.get('/:id/blogs', BlogController.getUserBlogs);

export default userRouter;
