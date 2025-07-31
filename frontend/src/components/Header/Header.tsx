import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Edit3, 
  Send,
  Home,
  Info,
  UserPlus,
  LogIn
} from 'lucide-react';

interface User {
  username: string;
  avatar?: string;
  isVerified: boolean;
}

interface HeaderProps {
  user: User | null;
  isAuthenticated: boolean;
  readyBlog?: unknown;
  onPublish?: () => void;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  isAuthenticated,
  onPublish, 
  onLogout 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const isAuthorized = isAuthenticated && user?.isVerified;
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const UserAvatar = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg'
    };

    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold overflow-hidden`}>
        {user?.avatar ? (
          <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
        ) : (
          user?.username?.[0]?.toUpperCase() || 'U'
        )}
      </div>
    );
  };

  const NotificationsMenu = () => (
    <AnimatePresence>
      {isNotificationsOpen && (
        <motion.div
          ref={notificationsRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
        >
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {[
              { id: 1, type: 'info', message: 'Your post received 5 new likes', time: '2 min ago' },
              { id: 2, type: 'warning', message: 'Your draft will be deleted in 7 days', time: '1 hour ago' },
              { id: 3, type: 'success', message: 'Welcome to InkTrail!', time: '1 day ago' }
            ].map((notification) => (
              <div key={notification.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    notification.type === 'info' ? 'bg-blue-500' :
                    notification.type === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-100">
            <button className="w-full text-center text-sm text-amber-600 hover:text-amber-700 font-medium">
              View all notifications
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const ProfileMenu = () => (
    <AnimatePresence>
      {isProfileMenuOpen && (
        <motion.div
          ref={profileMenuRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
        >
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <UserAvatar size="sm" />
              <div>
                <p className="font-medium text-gray-900">{user?.username}</p>
                <p className="text-sm text-gray-500">View profile</p>
              </div>
            </div>
          </div>
          
          <div className="py-2">
            <button
              onClick={() => {
                navigate('/profile');
                setIsProfileMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors duration-150"
            >
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">Profile</span>
            </button>
            
            <button
              onClick={() => {
                navigate('/settings');
                setIsProfileMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors duration-150"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">Settings</span>
            </button>
          </div>
          
          <div className="border-t border-gray-100 py-2">
            <button
              onClick={() => {
                onLogout?.();
                setIsProfileMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors duration-150 text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const MobileMenu = () => (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 md:hidden"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-150"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {isAuthorized ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <UserAvatar size="md" />
                    <div>
                      <p className="font-medium text-gray-900">{user?.username}</p>
                      <p className="text-sm text-gray-500">Verified user</p>
                    </div>
                  </div>
                  
                  <nav className="space-y-2">
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                    >
                      <User className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">Profile</span>
                    </Link>
                    
                    <Link
                      to="/settings"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                    >
                      <Settings className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">Settings</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        onLogout?.();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150 text-red-600"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </nav>
                </div>
              ) : (
                <nav className="space-y-2">
                  <Link
                    to="/welcome"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                  >
                    <Home className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Home</span>
                  </Link>
                  
                  <Link
                    to="/about"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                  >
                    <Info className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">About</span>
                  </Link>
                  
                  {location.pathname !== '/signin' && (
                    <Link
                      to="/signin"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                    >
                      <LogIn className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">Sign In</span>
                    </Link>
                  )}
                  
                  {location.pathname !== '/signup' && (
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                    >
                      <UserPlus className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">Sign Up</span>
                    </Link>
                  )}
                </nav>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/welcome')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-150"
            >
              <div className="w-10 h-10  rounded-lg flex items-center justify-center">
                <img className='w-full h-full' alt="logo" src="/public/icon.png" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                InkTrail
              </span>
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            {isAuthorized ? (
              <>
                {/* Action Buttons */}
                <div className="hidden md:flex items-center gap-2">
                  {location.pathname === '/new-fact' ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onPublish}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium"
                    >
                      <Send className="w-4 h-4" />
                      Publish
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/new-fact')}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-200 font-medium"
                    >
                      <Edit3 className="w-4 h-4" />
                      Write
                    </motion.button>
                  )}
                </div>

                {/* Notifications */}
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-150"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  </button>
                  <NotificationsMenu />
                </div>

                {/* Profile Menu */}
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-full transition-all duration-150"
                  >
                    <UserAvatar />
                  </button>
                  <ProfileMenu />
                </div>
              </>
            ) : (
              /* Guest Navigation */
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  to="/welcome"
                  className={`font-medium transition-colors duration-150 hover:text-gray-900 ${
                    path === '/welcome' ? 'text-orange-500' : 'text-gray-600'
                  }`}
                >
                  Home
                </Link>

                <Link
                  to="/about"
                  className={`font-medium transition-colors duration-150 hover:text-gray-900 ${
                    path === '/about' ? 'text-orange-500' : 'text-gray-600'
                  }`}
                >
                  About
                </Link>

                {path !== '/signin' && (
                  <Link
                    to="/signin"
                    className={`font-medium transition-colors duration-150 hover:text-gray-900 ${
                      path === '/signin' ? 'text-orange-500' : 'text-gray-600'
                    }`}
                  >
                    Sign In
                  </Link>
                )}

                {path !== '/signup' && (
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium"
                  >
                    Sign Up
                  </Link>
                )}
              </nav>
            )}
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-150"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu />
    </header>
  );
};

export default Header;
