import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  EyeIcon, Heart, MessageCircle, UserPlus, AtSign, Bell, Clock, ArrowRight, CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  fetchNotifications,
  markNotificationAsRead,
  Notification
} from "../../api/notificationApi"; // Adjust path to your API file
import { socket } from "../../helpers/socket"; // Adjust path to your socket file
import { useAuth } from "../../hooks/useAuth";

interface NotificationsMenuProps {
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (isOpen: boolean) => void; // Optional prop to control open state
  notificationsRef: React.RefObject<HTMLDivElement>;
  setBadgeUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  badgeUnreadCount: number; // Optional prop to display current unread count
}

export const NotificationsMenu: React.FC<NotificationsMenuProps> = ({
  isNotificationsOpen,
  setIsNotificationsOpen,
  notificationsRef,
  setBadgeUnreadCount,
  badgeUnreadCount,
}) => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (isNotificationsOpen) {
      loadNotifications();
    }
  }, [isNotificationsOpen]);

  useEffect(() => {
    if (!user) return;

    // Connect to the socket server
    socket.connect();

    // Register the logged-in user to the socket server
    socket.emit("registerUser", user._id);

    // Listen for incoming notifications
    socket.on("receiveNotification", () => {
      console.log("New notification received");
      setBadgeUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.off("receiveNotification");
    };
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response: Notification[] | { notifications: Notification[] } = await fetchNotifications({ isRead: false });
      // Check if response is an array (direct notifications array)
      if (Array.isArray(response)) {
        setNotifications(response);
      } 
      // Or if response is an object with a notifications property
      else if (
        response &&
        typeof response === "object" &&
        "notifications" in response &&
        Array.isArray((response as { notifications: Notification[] }).notifications)
      ) {
        setNotifications((response as { notifications: Notification[] }).notifications);
      } else {
        console.error("Unexpected notifications response format:", response);
        setNotifications([]);
      }
    } catch (err) {
      console.error("Error loading notifications:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setBadgeUnreadCount((prev: number) => prev - 1);
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "like": return "text-red-500 bg-red-50";
      case "follow": return "text-blue-500 bg-blue-50";
      case "comment": return "text-green-500 bg-green-50";
      case "mention": return "text-purple-500 bg-purple-50";
      default: return "text-gray-500 bg-gray-50";
    }
  };

  return (
    <AnimatePresence>
      {isNotificationsOpen && (
        <motion.div
          ref={notificationsRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-amber-50/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Notifications</h3>
              </div>
              {badgeUnreadCount > 0 && (
                <div className="flex items-center gap-1 text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full border border-red-200">
                  <span className="font-semibold">{badgeUnreadCount} new</span>
                </div>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              notifications.map((n, index) => (
                <motion.div
                  key={n._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 border-b border-gray-50 hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/30 transition-all duration-200 group cursor-pointer ${
                    !n.isRead ? 'bg-gradient-to-r from-amber-50/30 to-orange-50/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 relative">
                    {!n.isRead && (
                      <div className="absolute -left-2 top-3 w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                    )}

                    {/* Avatar */}
                    <div
                      onClick={() => navigate(`/profile/${n.sender.username}`)} 
                      className="flex-shrink-0">
                      <img
                        src={n.sender.avatar || "/default-avatar.png"}
                        alt={n.sender.username}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    </div>

                    {/* Content */}
                    <div
                      onClick={() => {
                        if (n.link) {
                          navigate(n.link);
                          handleMarkAsRead(n._id);
                        }
                      }}
                      className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`p-1 rounded-full ${getNotificationColor(n.type)}`}>
                          {n.type === "like" && <Heart className="w-4 h-4" />}
                          {n.type === "follow" && <UserPlus className="w-4 h-4" />}
                          {n.type === "comment" && <MessageCircle className="w-4 h-4" />}
                          {n.type === "mention" && <AtSign className="w-4 h-4" />}
                        </div>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full border bg-gray-50">
                          {n.type}
                        </span>
                      </div>

                      <p className="text-sm text-gray-900 leading-relaxed mb-2 line-clamp-2">
                        {n.title}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(n.createdAt).toLocaleString()}</span>
                        </div>
                        <button
                          onClick={() => handleMarkAsRead(n._id)}
                          className="flex items-center text-gray-400 hover:text-amber-600 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded-full hover:bg-amber-50"
                        >
                          {n.isRead ? (
                            <EyeIcon className="w-4 h-4" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-amber-50/30">
            <button
              onClick={() => {
                setIsNotificationsOpen(false);
                navigate('/notifications');
              }}
              className="w-full flex items-center justify-center gap-2 text-center text-sm text-amber-600 hover:text-amber-700 font-semibold py-2 px-4 rounded-lg hover:bg-amber-50 transition-all duration-200 group"
            >
              <span>View all notifications</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
