import React, { useState, useEffect, useRef } from 'react';
import { useAlert } from 'react-alert';
import { 
  User as UserIcon, Edit3, Calendar, Eye, Heart, MessageCircle, 
  Camera, MapPin, Link as LinkIcon, 
  CheckCircle, Plus, Grid, List, Bookmark,
  ArrowLeft, Share2, MoreHorizontal,
  EyeIcon,
  Trash,
  BookmarkX
} from 'lucide-react';
import type { Blog } from '../types/blogTypes';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from '../types/userTypes';
import { useData } from '../context/dataContext';
import { updateUser } from '../api/userApi';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase';
import ShareDropDown from '../components/AppComponents/ShareDropDown';
import FollowButton from '../components/BlogPage/FollowButton';

interface ProfilePageProps {
  userId?: string;
}

const ProfilePage: React.FC<ProfilePageProps> = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [bookmarks, setBookmarks] = useState<Blog[]>([]);
  const [activeTab, setActiveTab] = useState<'blogs' | 'bookmarks'>('blogs');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editMode, setEditMode] = useState(false);
  const [avatar, setAvatar] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    bio: '',
    avatar: ''
  });

  const { user: currentUser, getUser } = useAuth();
  const { getBlogsByUsername, removeBlog, setAction } = useData();
  const { username } = useParams<{ username: string }>();
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const alert = useAlert();

  const isOwnProfile = !username || username === currentUser?.username; // Check if viewing own profile

  useEffect(() => {
    loadProfileData()
  }, [username]);

  useEffect(() => {
    const updateAvatar = async () => {
      if (!image || !currentUser?._id || uploading) return;

      setUploading(true);

      try {
        const imageUrl = await uploadAvatar(image);
        await updateUser({ avatar: imageUrl });
        setAvatar(imageUrl);
        setImage(null);
      } catch (error) {
        console.error('Error updating avatar:', error);
      } finally {
        setUploading(false);
      }
    }
    updateAvatar();
  }, [image]);


  const loadProfileData = async () => {
    try {
      const targetUsername = username;
      if (!targetUsername) return;

      const [profileData, userBlogs] = await Promise.all([
        getUser(targetUsername),
        getBlogsByUsername(username, 20, 0) // Get user's blogs
      ]);

      setProfile(profileData);
      setBookmarks(profileData?.bookmarks || []);
      setAvatar(profileData?.avatar || '');
      // Filter blogs by author if needed
      setBlogs(userBlogs);
      
      if (profileData) {
        setEditData({
          username: profileData.username || '',
          bio: profileData.bio || '',
          avatar: profileData.avatar || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser?._id) return;

    try {
      await updateUser(editData);
      setProfile(prev => prev ? { ...prev, ...editData } : null);
      setEditMode(false);
      navigate(`/profile/${editData.username}`, { replace: true });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!currentUser?._id) return;

    try {
      await removeBlog(blogId);
      setBlogs(prev => prev.filter(blog => blog._id !== blogId));
      alert.success('Blog deleted successfully!');
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log('Selected file:', e.target.files[0]);
      setImage(e.target.files[0]);
    }
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    setProgress(0);

    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please select a valid image file'));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('File size must be less than 5MB'));
        return; 
      }

      // Create storage reference
      const storageRef = ref(storage, `avatars/${Date.now()}-${file.name}`);

      // Start the upload
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Listen for state changes
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress calculation
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUploading(false);
            resolve(downloadURL);
          });
        }
      )
    })
  }

  const handleUnsaveBlog = async (blogId: string) => {
    if (!currentUser?._id || !blogId) return;

    try {
      await setAction(blogId, 'bookmark');
      setBookmarks(prev => prev.filter(blog => blog._id !== blogId));
      alert.success('Blog unsaved successfully!');
    } catch (error) {
      console.error('Error unsaving blog:', error);
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <UserIcon className="w-16 h-16 text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-900">Profile not found</h2>
        <p className="text-gray-600">The user you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-white border-b border-gray-200 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <button onClick={() => setShareOpen(!shareOpen)} 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
                {shareOpen && (
                  <ShareDropDown setShareOpen={setShareOpen} text={profile.username} />
                )}
              </div>
              <button onClick={() => alert.info('Feature coming soon!')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal Overlay */}
      {shareOpen && (
        <div 
          className="fixed inset-0 bg-black/20"
          onClick={() => setShareOpen(false)}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-amber-100">
                  {avatar ? (
                    <img 
                      src={avatar} 
                      alt={profile.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <UserIcon className="w-16 h-16 text-white" />
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 flex rounded-full items-center justify-center bg-black bg-opacity-50">
                      <div className="w-4 h-4 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-white">Uploading...{Math.round(progress)}%</span>
                    </div>
                  )}
                </div>
                {isOwnProfile && (
                  <>
                    <button 
                      onClick={() => fileRef.current?.click()}
                      className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                    <input
                      type="file"
                      ref={fileRef}
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      aria-label="Avatar Upload"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  {editMode ? (
                    <input
                      type="text"
                      value={editData.username}
                      onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                      className="text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-amber-500 focus:outline-none"
                      placeholder="Your name"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                      {profile.username || profile.username}
                      {profile.isVerified && (
                        <CheckCircle className="w-6 h-6 text-blue-500" />
                      )}
                    </h1>
                  )}
                  <p className="text-gray-600 text-lg">@{profile.username}</p>
                </div>

                {isOwnProfile ? (
                  <div className="flex gap-2">
                    {editMode ? (
                      <>
                        <button
                          onClick={handleSaveProfile}
                          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditMode(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditMode(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                ) : (
                  <FollowButton authorId={profile._id} initialFollowed={profile.isFollowed || profile.followers.includes(currentUser?._id || '') || false} />
                )}
              </div>

              {/* Bio */}
              <div className="mb-6">
                {editMode ? (
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {profile.bio || 'No bio available'}
                  </p>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(profile.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>Location</span>
                </div>
                <div className="flex items-center gap-1">
                  <LinkIcon className="w-4 h-4" />
                  <span>website.com</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{blogs.length}</div>
                  <div className="text-gray-600">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{formatNumber(profile.followers.length)}</div>
                  <div className="text-gray-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{formatNumber(profile.following.length)}</div>
                  <div className="text-gray-600">Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('blogs')}
                  className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                    activeTab === 'blogs'
                      ? 'bg-amber-100 text-amber-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Blogs ({blogs.length})
                </button>
                {isOwnProfile && (
                  <button
                    onClick={() => setActiveTab('bookmarks')}
                    className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                      activeTab === 'bookmarks'
                        ? 'bg-amber-100 text-amber-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 inline mr-1" />
                    Bookmarks ({bookmarks?.length || 0})
                  </button>
                )}
                </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'blogs' && (
              <>
                {blogs.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {isOwnProfile ? 'Share your first story' : 'No posts yet'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {isOwnProfile 
                        ? 'Your stories help people learn, grow, and stay inspired.'
                        : 'This user hasn\'t published any posts yet.'
                      }
                    </p>
                    {isOwnProfile && (
                      <button className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium">
                        Write your first post
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-6'
                  }>
                    {blogs.map((blog) => (
                      <article
                        key={blog._id}
                        className={`group cursor-pointer ${
                          viewMode === 'grid'
                            ? 'bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300'
                            : 'flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors'
                        }`}
                      >
                        {viewMode === 'grid' ? (
                          <>
                            <div
                              className="aspect-video bg-gray-200 overflow-hidden relative group"
                            >
                              <img
                                src={
                                  blog.coverImage ||
                                  'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1'
                                }
                                alt={blog.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />

                              {/* Hover overlay */}
                              <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                                <button
                                  className="p-2 px-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow-md hover:from-green-600 hover:to-teal-700 transition-colors flex items-center gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/blog/${blog._id}`);
                                  }}
                                >
                                  <EyeIcon className="w-4 h-4 text-white" />
                                  <span className="font-medium text-white">Show</span>
                                </button>

                                <button
                                  className="p-2 px-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/edit-blog/${blog._id}`);
                                  }}
                                >
                                  <Edit3 className="w-4 h-4 text-white" />
                                  <span className="font-medium text-white">Edit</span>
                                </button>

                                <button
                                  className="p-2 px-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg shadow-md hover:from-red-600 hover:to-pink-700 transition-colors flex items-center gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.confirm('Are you sure you want to delete this blog?') &&
                                    handleDeleteBlog(blog._id);
                                  }}
                                >
                                  <Trash className="w-4 h-4 text-white" />
                                  <span className="font-medium text-white">Delete</span>
                                </button>
                              </div>
                            </div>

                            <div className="p-4">
                              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                                {blog.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {blog.excerpt?.substring(0, 100) || ''}...
                              </p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{new Date(blog.updatedAt).toLocaleDateString()}</span>
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {blog.views}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Heart className="w-3 h-3" />
                                    {blog.likes || 0} 
                                  </span>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={blog.coverImage || 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1'}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 relative group">
                              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">
                                {blog.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                {blog.excerpt?.substring(0, 150) || ''}...
                              </p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {blog.views}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Heart className="w-3 h-3" />
                                    {blog.likes || 0}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MessageCircle className="w-3 h-3" />
                                    {blog.comments || 0}
                                  </span>
                                </div>
                              </div>

                              {/* Hover overlay */}
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                                <button
                                  className="p-2 px-3  rounded-lg hover:bg-gray-200 hover:text-yellow-500 transition-colors flex items-center gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/blog/${blog._id}`);
                                  }}
                                >
                                  <EyeIcon className="w-4 h-4 " />
                                  <span className="font-medium ">Show</span>
                                </button>

                                <button
                                  className="p-2 px-3  rounded-lg hover:bg-gray-200 hover:text-blue-500 transition-colors flex items-center gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/edit-blog/${blog._id}`);
                                  }}
                                >
                                  <Edit3 className="w-4 h-4 " />
                                  <span className="font-medium ">Edit</span>
                                </button>

                                <button
                                  className="p-2 px-3 rounded-lg hover:bg-gray-200 hover:text-red-500 transition-colors flex items-center gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.confirm('Are you sure you want to delete this blog?') &&
                                    handleDeleteBlog(blog._id);
                                  }}
                                >
                                  <Trash className="w-4 h-4 " />
                                  <span className="font-medium ">Delete</span>
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'bookmarks' && (
              <>
                {bookmarks && bookmarks.length > 0 ? (
                  <div className={viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-6'
                  }>
                    {bookmarks.map((blog) => (
                      <article
                        key={blog._id}
                        className={`group cursor-pointer ${
                          viewMode === 'grid'
                            ? 'bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300'
                            : 'flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors'
                        }`}
                      >
                        {viewMode === 'grid' ? (
                          <>
                            <div className="aspect-video bg-gray-200 overflow-hidden relative group">
                              <img
                                src={blog.coverImage || 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1'}
                                alt={blog.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {/* Hover overlay */}
                              <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                                <button
                                  className="p-2 px-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/blog/${blog._id}`);
                                  }}
                                >
                                  <EyeIcon className="w-4 h-4 " />
                                  <span className="font-medium ">Show</span>
                                </button>

                                <button
                                  className="p-2 px-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg hover:from-orange-700 hover:to-red-700 transition-colors flex items-center gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnsaveBlog(blog._id);
                                  }}
                                >
                                  <BookmarkX className="w-4 h-4 " />
                                  <span className="font-medium ">Unsave</span>
                                </button>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                                {blog.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {blog.excerpt?.substring(0, 100) || ''}...
                              </p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{new Date(blog.updatedAt).toLocaleDateString()}</span>
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {blog.views}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Heart className="w-3 h-3" />
                                    {blog.likes || 0} 
                                  </span>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={blog.coverImage || 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1'}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 relative group">
                              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">
                                {blog.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                {blog.excerpt?.substring(0, 150) || ''}...
                              </p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {blog.views}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Heart className="w-3 h-3" />
                                    {blog.likes || 0}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MessageCircle className="w-3 h-3" />
                                    {blog.comments || 0}
                                  </span>
                                </div>
                              </div>
                              {/* Hover overlay */}
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                                <button
                                  className="p-2 px-3  rounded-lg hover:bg-gray-200 hover:text-yellow-500 transition-colors flex items-center gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/blog/${blog._id}`);
                                  }}
                                >
                                  <EyeIcon className="w-4 h-4 " />
                                  <span className="font-medium ">Show</span>
                                </button>

                                <button
                                  className="p-2 px-3 rounded-lg hover:bg-gray-200 hover:text-orange-500 transition-colors flex items-center gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnsaveBlog(blog._id);
                                  }}
                                >
                                  <BookmarkX className="w-4 h-4 " />
                                  <span className="font-medium ">Unsave</span>
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bookmark className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookmarks yet</h3>
                    <p className="text-gray-600">
                      {isOwnProfile 
                        ? 'Bookmark posts to read them later.'
                        : 'This user hasn\'t bookmarked any posts yet.'
                      }
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;