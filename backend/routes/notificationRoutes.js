import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  deleteNotification,
  markAllAsRead
} from '../controllers/notificationController.js';
import { isAuthenticatedUser } from '../middlewares/auth.js'; // Your auth middleware
import { validate } from '../middlewares/validate.js';


const router = express.Router();

// Protect all notification routes — user must be authenticated
router.use(isAuthenticatedUser);

// Id validation middleware can be added here if needed
router.use(validate);

// Get all notifications for the authenticated user
router.get('/', getNotifications);

// Get unread notification count
router.get('/count', getUnreadCount);

// Mark a notification as read
router.patch('/:id/read', markAsRead);

router.patch('/read-all', markAllAsRead);

// Delete a notification
router.delete('/:id', deleteNotification);

export default router;
