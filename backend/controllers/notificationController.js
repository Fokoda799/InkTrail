// controllers/notificationController.js
import Notification from '../models/notificationModel.js';
import mongoose from 'mongoose';


/**
 * @desc Get all notifications for a user
 * @route GET /api/notifications
 * @access Private
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id; // From authentication middleware
    const options = req.query; // Get query params for pagination, filtering, etc.

    const notifications = await Notification.find({ recipient: userId, ...options })
      .sort({ createdAt: -1 })
      .populate('sender', 'username avatar') // Get sender info
      .lean(); // Convert to plain JavaScript objects for easier manipulation

    res.json(notifications);
  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    res.status(500).json({ error: 'Server error fetching notifications.' });
  }
};

/**
 * @desc Get unread notifications count
 * @route GET /api/notifications/count
 * @access Private
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id; // From authentication middleware

    const count = await Notification.countDocuments({
      recipient: userId,
      isRead: false
    });

    res.json({ count });
  } catch (error) {
    console.error('❌ Error fetching unread notifications count:', error);
    res.status(500).json({ error: 'Server error fetching unread notifications count.' });
  }
};

/**
 * @desc Mark a notification as read
 * @route PATCH /api/notifications/:id/read
 * @access Private
 */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      console.error('❌ Notification not found:', id);
      return res.status(404).json({ error: 'Notification not found.' });
    }

    res.json(notification);
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    res.status(500).json({ error: 'Server error marking as read.' });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id; // From authentication middleware

    const result = await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );

    if (result.nModified === 0) {
      console.log('No unread notifications to mark as read.');
      return res.status(200).json({ message: 'No unread notifications to mark as read.' });
    }

    res.json({ message: 'All unread notifications marked as read.' });
  } catch (error) {
    console.error('❌ Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Server error marking all notifications as read.' });
  }
}

/**
 * @desc Delete a notification
 * @route DELETE /api/notifications/:id
 * @access Private
 */
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Notification.findByIdAndDelete(id);

    if (!deleted) {
      console.error('❌ Notification not found:', id);
      return res.status(404).json({ error: 'Notification not found.' });
    }

    res.json({ message: '✅ Notification deleted successfully.' });
  } catch (error) {
    console.error('❌ Error deleting notification:', error);
    res.status(500).json({ error: 'Server error deleting notification.' });
  }
};
