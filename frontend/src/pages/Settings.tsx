import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Palette, 
  Info, 
  HelpCircle, 
  ExternalLink,
  Moon,
  Sun,
  Check,
  Eye,
  EyeOff,
  Save,
  Mail,
  MessageCircle,
  Heart,
  Smartphone,
  Monitor,
  ChevronDown,
  ChevronRight,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { updateUser } from '../api/userApi';
import { useAlert } from 'react-alert';

interface SettingsPageProps {}

const SettingsPage: React.FC<SettingsPageProps> = () => {
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    security: false,
    appearance: false,
    language: false,
    notifications: false,
    about: false,
    help: false,
    danger: false
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system');
  const [language, setLanguage] = useState('en');
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [savePassword, setSavePassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [notifications, setNotifications] = useState({
    like: true,
    comment: true,
    follow: true,
    costume: true,
    email: true,
    push: true
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const { user: currentUser, setUser, updatePassword, deleteAccount } = useAuth();
  const alert = useAlert();

  useEffect(() => {
    if (!currentUser) return;
    setThemeMode(currentUser.theme || 'system');
    setLanguage(currentUser.Language || 'en');
    setNotifications(currentUser.notification);
    return;
  }, [currentUser]);

  useEffect(() => {
    if (localError) {
      alert.error(localError || 'An error occurred');
    }
    return;
  }, [localError]);

  useEffect(() => {
    const confirmMatches = !!currentPassword === (currentUser?.withPassword) || false;

    if (!!confirmPassword && !!newPassword && confirmMatches) {
      setSavePassword(true);
      return;
    }
    setSavePassword(false);

    return;
  }, [currentPassword, newPassword, confirmPassword]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const languages = [
  { code: 'ar', name: 'العربية', flag: '🇲🇦' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];


  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    const user = await updatePassword(currentPassword, newPassword);
    setUser(user);
    setPasswordSuccess('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      return;
    }

    await deleteAccount();
    setShowDeleteConfirm(false);
    setDeleteConfirmText('');
  };

  const handleNotificationChange = async (key: keyof typeof notifications) => {
    console.log("test");
    try {
      await updateUser({ notification: { ...notifications, [key]: !notifications[key] } });
      setNotifications(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    } catch (err) {
      console.error(err)
    }
  };

  const handleThemeChange = async (mode: 'light' | 'dark' | 'system') => {
    setLocalError('');
    try {
      console.log("test!");
      await updateUser({ theme: mode });
      setThemeMode(mode as any);
      alert.info('Theme mode is coming soon — stay tuned!')
    } catch (error: unknown) {
      console.error("Failed to update theme:", error);
      setLocalError((error as Error).message || 'Failed to update theme');
    } finally {
      setLocalError('');
    }
  };

  // const getThemeIcon = () => {
  //   switch (themeMode) {
  //     case 'light': return <Sun className="w-5 h-5" />;
  //     case 'dark': return <Moon className="w-5 h-5" />;
  //     case 'system': return <Monitor className="w-5 h-5" />;
  //     default: return <Sun className="w-5 h-5" />;
  //   }
  // };

  const selectedLanguage = languages.find(lang => lang.code === language);

  const SectionHeader = ({ 
    icon, 
    title, 
    description, 
    sectionKey, 
    iconBg = 'bg-amber-100', 
    iconColor = 'text-amber-600' 
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    sectionKey: string;
    iconBg?: string;
    iconColor?: string;
  }) => (
    <button
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
          <div className={iconColor}>{icon}</div>
        </div>
        <div className="text-left">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
      {expandedSections[sectionKey] ? (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-400" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-white border-b border-gray-200 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            
            <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
            
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 space-y-4">
        {/* Security Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionHeader
            icon={<Lock className="w-5 h-5" />}
            title="Security"
            description="Manage your password and account security"
            sectionKey="security"
          />
          
          {expandedSections.security && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="space-y-6 pt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password {currentUser?.withPassword ? '' : '(Not set yet)'}
                  </label>
                  <div className="relative">
                    <input
                      disabled={!currentUser?.withPassword}
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${!currentUser?.withPassword ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Enter your current password"
                    />
                    <button
                      disabled={!currentUser?.withPassword}
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className={`absolute right-3 top-3 text-gray-400 hover:text-gray-600 ${!currentUser?.withPassword ? 'hidden' : ''}`}
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {passwordError && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-200 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    {passwordSuccess}
                  </div>
                )}

                <button
                  onClick={handlePasswordChange}
                  disabled={!savePassword}
                  className={`flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium ${!savePassword ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  <Save className="w-4 h-4" />
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Appearance Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionHeader
            icon={<Palette className="w-5 h-5" />}
            title="Appearance"
            description="Customize how the app looks for you"
            sectionKey="appearance"
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
          
          {expandedSections.appearance && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Theme Mode
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['light', 'dark', 'system'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => handleThemeChange(mode as 'light' | 'dark' | 'system')}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        themeMode === mode
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {mode === 'light' && <Sun className="w-6 h-6" />}
                      {mode === 'dark' && <Moon className="w-6 h-6" />}
                      {mode === 'system' && <Monitor className="w-6 h-6" />}
                      <span className="text-sm font-medium capitalize">{mode}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Language Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <SectionHeader
            icon={<Globe className="w-5 h-5" />}
            title="Language & Region"
            description="Choose your preferred language"
            sectionKey="language"
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          
          {expandedSections.language && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="pt-6 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <button
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-left flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{selectedLanguage?.flag}</span>
                    <span>{selectedLanguage?.name}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {languageDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLocalError('');
                          try {
                            updateUser({ Language: lang.code as 'en' | 'fr' | 'ar' });
                            setLanguage(lang.code);
                            setLanguageDropdownOpen(false);
                            alert.info('New language options are on the way. Stay tuned!');
                          } catch (error) {
                            console.log(error);
                            setLocalError(
                              error && typeof error === 'object' && 'message' in error
                                ? (error as { message?: string }).message || 'Failed to change language'
                                : 'Failed to change language'
                            );
                          }
                        }}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 ${
                          language === lang.code ? 'bg-amber-50 text-amber-700' : ''
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                        {language === lang.code && <Check className="w-4 h-4 ml-auto" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionHeader
            icon={<Bell className="w-5 h-5" />}
            title="Notifications"
            description="Control what notifications you receive"
            sectionKey="notifications"
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
          
          {expandedSections.notifications && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="space-y-6 pt-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Notification Channels</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">Email Notifications</div>
                          <div className="text-sm text-gray-600">Receive notifications via email</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('email')}
                        className={`relative w-12 h-6 rounded-full transition-colors`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform `} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">Push Notifications</div>
                          <div className="text-sm text-gray-600">Receive push notifications on your device</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('push')}
                        className={`relative w-12 h-6 rounded-full transition-color`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Activity Notifications</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'like', icon: Heart, label: 'Likes', desc: 'When someone likes your posts', },
                      { key: 'comment', icon: MessageCircle, label: 'Comments', desc: 'When someone comments on your posts' },
                      { key: 'follow', icon: User, label: 'New Followers', desc: 'When someone follows you' },
                      // { key: 'marketing', icon: Mail, label: 'Marketing Emails', desc: 'Product updates and marketing emails' }
                    ].map(({ key, icon: Icon, label, desc }) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">{label}</div>
                            <div className="text-sm text-gray-600">{desc}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleNotificationChange(key as keyof typeof notifications)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            notifications[key as keyof typeof notifications] ? 'bg-amber-500' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            notifications[key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* About Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionHeader
            icon={<Info className="w-5 h-5" />}
            title="About & Information"
            description="Learn more about our platform and policies"
            sectionKey="about"
            iconBg="bg-indigo-100"
            iconColor="text-indigo-600"
          />
          
          {expandedSections.about && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Platform Information</h3>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p><strong>Version:</strong> 2.1.0</p>
                      <p><strong>Last Updated:</strong> January 15, 2025</p>
                      <p><strong>Build:</strong> 2025.01.15.1</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Your Account</h3>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p><strong>Member Since:</strong> {currentUser?.createdAt
                        ? new Date(currentUser.createdAt).toLocaleString('en-US', { month: 'long', year: 'numeric' })
                        : 'N/A'} </p>
                      <p><strong>Blogs Published:</strong> {currentUser?.blogsCount || 0}</p>
                      <p><strong>Total Followers:</strong> {currentUser?.followers?.length || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Company</h3>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p>InkTrail is a modern blogging platform designed for writers and content creators who want to share their stories with the world.</p>
                      <p>Founded in 2024, we're committed to providing the best writing and reading experience.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help & Support Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionHeader
            icon={<HelpCircle className="w-5 h-5" />}
            title="Help & Support"
            description="Get help and find important links"
            sectionKey="help"
            iconBg="bg-orange-100"
            iconColor="text-orange-600"
          />
          
          {expandedSections.help && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Help Center</h3>
                  <div className="space-y-3">
                    {[
                      'Getting Started Guide',
                      'Frequently Asked Questions',
                      'Writing Best Practices',
                      'Contact Support'
                    ].map((item) => (
                      <a key={item} href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                        <span className="text-gray-700 group-hover:text-amber-600">{item}</span>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-amber-600" />
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Legal & Policies</h3>
                  <div className="space-y-3">
                    {[
                      'Terms of Service',
                      'Privacy Policy',
                      'Cookie Policy',
                      'Community Guidelines'
                    ].map((item) => (
                      <a key={item} href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                        <span className="text-gray-700 group-hover:text-amber-600">{item}</span>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-amber-600" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    <p>Need immediate help? <a href="#" className="text-amber-600 hover:text-amber-700 font-medium">Chat with support</a></p>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>© 2025 BlogHub. All rights reserved.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Danger Zone Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden">
          <SectionHeader
            icon={<AlertTriangle className="w-5 h-5" />}
            title="Danger Zone"
            description="Irreversible and destructive actions"
            sectionKey="danger"
            iconBg="bg-red-100"
            iconColor="text-red-600"
          />
          
          {expandedSections.danger && (
            <div className="px-6 pb-6 border-t border-red-100">
              <div className="pt-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-medium text-red-900 mb-2">Delete Account</h3>
                      <p className="text-sm text-red-700 mb-4">
                        Once you delete your account, there is no going back. Please be certain. This action will permanently delete your account, all your posts, and remove all associated data.
                      </p>
                      
                      {!showDeleteConfirm ? (
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Account
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-red-900 mb-2">
                              Type "DELETE" to confirm account deletion
                            </label>
                            <input
                              type="text"
                              value={deleteConfirmText}
                              onChange={(e) => setDeleteConfirmText(e.target.value)}
                              className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder="Type DELETE here"
                            />
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={handleDeleteAccount}
                              disabled={deleteConfirmText !== 'DELETE'}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="w-4 h-4" />
                              Confirm Delete
                            </button>
                            <button
                              onClick={() => {
                                setShowDeleteConfirm(false);
                                setDeleteConfirmText('');
                              }}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Language dropdown overlay */}
      {languageDropdownOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setLanguageDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default SettingsPage;