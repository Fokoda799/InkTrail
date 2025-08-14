import { Router } from 'express';
import UserController from '../controllers/userController.js';
import AuthController from '../controllers/authController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middlewares/auth.js';

const userRouter = Router();
const authRouter = Router();
const adminRouter = Router();

// Admin routes
adminRouter.get('/', isAuthenticatedUser, authorizeRoles('admin'), UserController.getAllUsers);
// adminRouter.get('/:id', isAuthenticatedUser, authorizeRoles('admin'), UserController.getUserById);
adminRouter.put('/:id', isAuthenticatedUser, authorizeRoles('admin'), UserController.updateUser);
adminRouter.delete('/:id', isAuthenticatedUser, authorizeRoles('admin'), UserController.deleteUser);

// User routes
userRouter.put('/me', isAuthenticatedUser, UserController.updateMe);
userRouter.get('/follow-status/:targetUserId', isAuthenticatedUser, UserController.getFollowStatus);
userRouter.post('/follow', isAuthenticatedUser, UserController.followUser);
userRouter.get('/profile/:username', isAuthenticatedUser, UserController.getUser);

// Auth routes
authRouter.get('/me', isAuthenticatedUser, AuthController.getMe);
authRouter.post('/sign-up', UserController.createUser);
authRouter.post('/sign-in', AuthController.connectUser); // Changed to POST for security
authRouter.post('/google', AuthController.signinWithGoogle);
authRouter.get('/logout', isAuthenticatedUser, AuthController.disconnectUser);
authRouter.post('/verify-email', isAuthenticatedUser, AuthController.verifyEmail);
authRouter.get('/check-auth', isAuthenticatedUser, AuthController.checkAuth);
authRouter.post('/resend-verification-email', isAuthenticatedUser, AuthController.resendVerificationEmail);
authRouter.put('/update-password', isAuthenticatedUser, AuthController.updatePassword);
authRouter.delete('/delete-account', isAuthenticatedUser, AuthController.deleteAccount);

export { userRouter, authRouter, adminRouter };
