import { Router } from 'express';
import UserController from '../controllers/userController.js';
// import AuthController from '../controllers/authController.js';

// Create a new router
const router = Router();

// Define user routes
router.get('/users', UserController.getAllUsers);
router.get('/users/:id', UserController.getUserById);
router.post('/users', UserController.createUser);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

// Define auth routes
// router.post('/login', AuthController.connectUser);
// router.get('/me', UserController.getMe);
// router.post('/logout', AuthController.disconnectUser);

export default router;