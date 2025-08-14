import { User } from '../types/userTypes'; // Adjust the import path as needed

const API_BASE = '/api/v1/notifications'; // Adjust as needed


export interface Target {
  id: string;
  type: string; // e.g., "Post", "Comment"
  link?: string;
  preview?: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  sender: User;
  type: 'like' | 'comment' | 'mention' | 'follow' | 'custom';
  title: string;
  message: string;
  target?: Target;
  isRead: boolean;
  link?: string; // Optional link for the notification
  relatedContent?: {
    type?: string,
    title?: string,
    excerpt?: string,
  };
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  pages: number;
}

// Helper to get auth headers (modify according to your auth flow)
function getAuthHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
  };
}

/**
 * Fetch notifications for the logged-in user
 * @param page Pagination page number
 * @returns notifications and pagination info
 */
export async function fetchNotifications(
  options: { isRead?: boolean } = {}
): Promise<Notification[]> {
  const params: Record<string, string> = {};
  if (typeof options.isRead === 'boolean') {
    params.isRead = String(options.isRead);
  }
  const response = await fetch(`${API_BASE}?${new URLSearchParams(params)}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }

  return response.json();
}

/**
 * Get unread notifications count
 * @returns notifications count
 */
export async function getUnreadCount(): Promise<number> {
  const response = await fetch(`${API_BASE}/count`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch unread notifications count');
  }

  const data = await response.json();
  return data.count;
}

/**
 * Mark a notification as read
 * @param notificationId
 * @returns updated notification
 */
export async function markNotificationAsRead(
  notificationId: string
): Promise<Notification> {
  const response = await fetch(`${API_BASE}/${notificationId}/read`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to mark notification as read');
  }

  return response.json();
}

/**
 * Mark a notification as read
 * @returns updated notifications
 */
export async function markAllNotificationsAsRead(): Promise<Notification[]> {
  const response = await fetch(`${API_BASE}/read-all`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to mark all notifications as read');
  }

  return response.json();
}

/**
 * Delete a notification
 * @param notificationId
 * @returns success message object
 */
export async function deleteNotification(
  notificationId: string
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE}/${notificationId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete notification');
  }

  return response.json();
}