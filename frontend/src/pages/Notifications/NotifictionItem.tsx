import React from 'react';
import { 
  Heart, 
  UserPlus, 
  MessageCircle, 
  AtSign, 
  FileText,
  Clock,
  Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../../api/notificationApi';

interface NotificationItemProps {
  notification: Notification;
  onToggleRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onToggleRead }) => {
  const navigate = useNavigate();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-blue-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-green-500" />;
      case 'mention':
        return <AtSign className="w-5 h-5 text-purple-500" />;
      case 'blog':
        return <FileText className="w-5 h-5 text-amber-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'like':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'follow':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'comment':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'mention':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'post':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const formatTimeAgo = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };


  return (
    <div id={notification._id} className={`relative p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
      notification.isRead 
        ? 'bg-white border-gray-200 hover:border-gray-300' 
        : 'bg-gradient-to-br from-amber-50 to-orange-50/30 border-amber-200 hover:border-amber-300 shadow-sm'
    }`}>
      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-sm"></div>
      )}

      <div className="flex items-start gap-4">
        {/* User Avatar */}
        <div 
          onClick={() => navigate(`/profile/${notification.sender.username}`)}
          className="flex-shrink-0">
          <img
            src={notification.sender.avatar}
            alt={notification.sender.username}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {getNotificationIcon(notification.type)}
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(notification.type)}`}>
                {notification.type}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{formatTimeAgo(notification.createdAt)}</span>
            </div>
          </div>

          <div 
            onClick={() => {
              if (notification.link) {
                navigate(notification.link);
                if (!notification.isRead) {
                  onToggleRead(notification._id);
                }
              }
            }}
            className={`cursor-pointer`}>
            <h3 className="font-semibold text-gray-900 mb-1 leading-snug">
              {notification.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-3 leading-relaxed">
              {notification.message}
            </p>
          </div>

          {/* Related Content */}
          {notification.relatedContent && (
            <div
              onClick={() => {
                if (notification.link) {
                  navigate(notification.link);
                  onToggleRead(notification._id);
                }
              }}
              className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3 cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {notification.relatedContent.title}
                </span>
              </div>
              {notification.relatedContent.excerpt && (
                <p className="text-xs text-gray-500 line-clamp-2">
                  {notification.relatedContent.excerpt}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleRead(notification._id)}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                notification.isRead
                  ? 'text-gray-600 hover:text-amber-700 hover:bg-amber-50'
                  : 'text-amber-700 hover:text-amber-800 hover:bg-amber-100 bg-amber-50'
              }`}
            >
              {!notification.isRead && (
                <>
                  <Eye className="w-3 h-3" />
                  Mark read
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;