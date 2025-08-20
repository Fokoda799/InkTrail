import { User } from '../types/userTypes';
import { apiFetch } from './api';

export interface Target {
  id: string;
  type: string;
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
  link?: string;
  relatedContent?: { type?: string; title?: string; excerpt?: string };
  createdAt: string;
  updatedAt: string;
}

export const fetchNotifications = async (options: { isRead?: boolean } = {}): Promise<Notification[]> => {
  const params = new URLSearchParams();
  if (typeof options.isRead === 'boolean') params.append('isRead', String(options.isRead));

  const res = await apiFetch(`/notifications?${params.toString()}`, {
    method: 'GET',
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch notifications');
  return data;
};

export const getUnreadCount = async (): Promise<number> => {
  const res = await apiFetch('/notifications/count', {
    method: 'GET',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch unread count');
  return data.count;
};

export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
  const res = await apiFetch(`/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to mark notification as read');
  return data;
};

export const markAllNotificationsAsRead = async (): Promise<Notification[]> => {
  const res = await apiFetch('/notifications/read-all', {
    method: 'PATCH',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to mark all as read');
  return data;
};

export const deleteNotification = async (notificationId: string): Promise<{ message: string }> => {
  const res = await apiFetch(`/notifications/${notificationId}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete notification');
  return data;
};