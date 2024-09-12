import { Router } from 'express';
import UserController from '../controllers/userController.js';
import AuthController from '../controllers/authController.js';
import BlogController from '../controllers/blogController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middlewares/auth.js';

// Create a new router
const userRouter = Router();

// Define user routes
userRouter.get('/admin/users', isAuthenticatedUser, authorizeRoles('admin'), UserController.getAllUsers);
userRouter.get('/admin/user/:id', isAuthenticatedUser, authorizeRoles('admin'), UserController.getUserById);
userRouter.put('/admin/user/:id', isAuthenticatedUser, authorizeRoles('admin'), UserController.updateUser);
userRouter.put('/admin/user/:id/role', isAuthenticatedUser, authorizeRoles('admin'), UserController.updateUserRole);
userRouter.delete('/admin/user/:id', isAuthenticatedUser, authorizeRoles('admin'), UserController.deleteUser);

// Define auth routes
userRouter.post('/user/register', UserController.createUser);
userRouter.get('/user/login', AuthController.connectUser);
userRouter.get('/me', isAuthenticatedUser, UserController.getMe);
userRouter.get('/user/logout', AuthController.disconnectUser);

export default userRouter;
