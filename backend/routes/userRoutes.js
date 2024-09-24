import { Router } from 'express';
import UserController from '../controllers/userController.js';
import AuthController from '../controllers/authController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middlewares/auth.js';

const userRouter = Router();
const authRouter = Router();
const adminRouter = Router();

// Admin routes
adminRouter.get('/', isAuthenticatedUser, authorizeRoles('admin'), UserController.getAllUsers);
adminRouter.get('/:id', isAuthenticatedUser, authorizeRoles('admin'), UserController.getUserById);
adminRouter.put('/:id', isAuthenticatedUser, authorizeRoles('admin'), UserController.updateUser);
adminRouter.put('/:id/role', isAuthenticatedUser, authorizeRoles('admin'), UserController.updateUserRole);
adminRouter.delete('/:id', isAuthenticatedUser, authorizeRoles('admin'), UserController.deleteUser);

// User routes
userRouter.get('/me', isAuthenticatedUser, UserController.getMe);
userRouter.put('/me', isAuthenticatedUser, UserController.updateMe);
userRouter.put('/me/update-password', isAuthenticatedUser, AuthController.updatePassword);
userRouter.put('/follow/:id', isAuthenticatedUser, UserController.followUser);

// Auth routes
authRouter.post('/sign-up', UserController.createUser);
authRouter.get('/sign-in', AuthController.connectUser); // Changed to POST for security
authRouter.post('/google', AuthController.signinWithGoogle);
authRouter.get('/logout', isAuthenticatedUser, AuthController.disconnectUser);
// authRouter.post('/forgot-password', AuthController.forgotPassword);
// authRouter.put('/reset-password/:token', AuthController.resetPassword);
authRouter.post('/verify-email', isAuthenticatedUser, AuthController.verifyEmail);
authRouter.get('/check-auth', isAuthenticatedUser, AuthController.checkAuth);

export { userRouter, authRouter, adminRouter };
