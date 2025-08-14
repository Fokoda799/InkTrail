import { useState, useMemo, useEffect } from 'react';
import { 
  Bell, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BellOff
} from 'lucide-react';
import { useAlert } from 'react-alert';

import NotificationItem from './NotifictionItem';
import FilterControls from './FilterControls';
import Pagination from './Pagination';

import { 
  fetchNotifications, 
  markNotificationAsRead,
  markAllNotificationsAsRead,
  Notification
} from '../../api/notificationApi';


export interface NotificationFilters {
  type: 'all' | 'like' | 'follow' | 'comment' | 'mention' | 'post';
  status: 'all' | 'read' | 'unread';
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filters, setFilters] = useState<NotificationFilters>({
    type: 'all',
    status: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6
  });
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const alert = useAlert();

  // Filter and paginate notifications client-side after fetching
  const { filteredNotifications, unreadCount } = useMemo(() => {
    let filtered = notifications;

    if (filters.type !== 'all') {
      filtered = filtered.filter(n => n.type === filters.type);
    }
    if (filters.status === 'read') {
      filtered = filtered.filter(n => n.isRead);
    } else if (filters.status === 'unread') {
    filtered = filtered.filter(n => !n.isRead);
    }

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return { 
      filteredNotifications: filtered, 
      unreadCount 
    };
  }, [notifications, filters]);

  useEffect(() => {
    // Fetch notifications from API when page or filters change
    const loadNotifications = async () => {
      try {
        const response = await fetchNotifications();
        setNotifications(response);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 6,
        });
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        alert.error('Failed to load notifications');
      }
    };

    loadNotifications();
  }, [currentPage]);

  // Mark single notification as read/unread, then update state and call backend
  const handleToggleRead = async (id: string) => {
    const notification = notifications.find(n => n._id === id);
    if (!notification) return;

    try {
      // Call backend only if marking as read (you can adjust to toggle)
      if (!notification.isRead) {
        await markNotificationAsRead(id);
      }

      setNotifications(prev => 
        prev.map(n => 
          n._id === id ? { ...n, isRead: !n.isRead } : n
        )
      );

      alert.success(notification.isRead ? 'Marked as unread' : 'Marked as read');
    } catch {
      alert.error('Failed to update notification status');
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    setIsMarkingAllRead(true);
    try {
      await markAllNotificationsAsRead();
      const unreadNotifications = notifications.filter(n => !n.isRead);
      await Promise.all(unreadNotifications.map(n => markNotificationAsRead(n._id)));

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

      alert.success('All notifications marked as read!');
      setShowConfirmModal(false);
    } catch {
      alert.error('Failed to mark all as read');
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  const handleFilterChange = (newFilters: NotificationFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // reset page on filter change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50/30">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-amber-50/30 backdrop-blur-sm border-b border-gray-200 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <div className="flex-shrink-0">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 group hover:bg-gray-50 px-3 py-2 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium">Back</span>
              </button>
            </div>

            {/* Title */}
            <div className="flex-grow text-center">
              <div className="inline-flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
                {unreadCount > 0 && (
                  <div className="flex items-center gap-1 text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full border border-red-200">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-semibold">{unreadCount} new</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0">
              {unreadCount > 0 && (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark All Read</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Filter Controls */}
          <FilterControls 
            filters={filters}
            onFilterChange={handleFilterChange}
            unreadCount={unreadCount}
          />

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(notification => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onToggleRead={handleToggleRead}
                />
              ))
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <BellOff className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {filters.type !== 'all' || filters.status !== 'all'
                    ? 'Try adjusting your filters to see more notifications.'
                    : 'You\'re all caught up! New notifications will appear here.'}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Mark all as read?</h2>
                    <p className="text-gray-600 text-sm">This will mark {unreadCount} notifications as read.</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-6">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isMarkingAllRead}
                  className="px-6 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={isMarkingAllRead}
                  className="flex items-center gap-2 px-8 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:transform-none"
                >
                  {isMarkingAllRead ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Marking...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark All Read</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;
