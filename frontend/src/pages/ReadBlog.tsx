// 📦 React and hooks
import React, { useCallback, useEffect } from 'react';

// 🎨 Animation
import { motion, AnimatePresence } from 'framer-motion';

// 🎯 Icons
import { 
  ArrowLeft, Clock, Calendar, Heart, MessageCircle, Share2, 
  Bookmark, User, Eye, Twitter, Facebook, Link as LinkIcon, 
  CheckCircle, AlertCircle, Loader2 
} from 'lucide-react';
import LikeButton from '../components/BlogPage/Like';

// 📚 Context
import { useData } from '../context/dataContext';
import { useAlert } from 'react-alert';
import { useParams } from 'react-router-dom';

const ReadBlog: React.FC = () => {

  // 🗂️ Context
  const { blog, isLoading, error, getBlogById } = useData();
  const params = useParams();

  const [hasFetched, setHasFetched] = React.useState(false);

  // Default author object
  const defaultAuthor = { 
    name: 'Unknown Author', 
    avatar: '',
    username: 'anonymous',
    bio: '',
    isVerified: false,
    followers: 0
  };

  // Get author data with fallbacks
  const author = blog?.author || defaultAuthor;
  const id = params.id || blog?._id;

  // Fetch blog data
  const fetchBlog = useCallback(async (blogId: string) => {
    if (!blogId || hasFetched) return;

    try {
      await getBlogById(blogId);
      setHasFetched(true);
    } catch (err) {
      console.error('Failed to fetch blog:', err);
    }
  }, [getBlogById, hasFetched]);

  useEffect(() => {
    if (!id) return;
    
    // Add cancellation to prevent memory leaks
    let isMounted = true;
    if (isMounted) {
      fetchBlog(id);
    }
    
    return () => {
      isMounted = false;
    };
  }, [id, fetchBlog]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-gray-500">Loading blog post...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-2 p-4 text-center">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <h3 className="text-lg font-medium text-gray-900">Failed to load blog</h3>
        <p className="text-gray-600">{error || 'Unknown error occurred'}</p>
        <button 
          onClick={() => fetchBlog(id)}
          className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // No blog found state
  if (!blog && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-2 p-4 text-center">
        <AlertCircle className="w-8 h-8 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">Blog not found</h3>
        <p className="text-gray-600">The blog post you're looking for doesn't exist or may have been removed.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-150"
          style={{ width: `0%` }}
        />
      </div>

      {/* Navigation Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            
            <div className="flex items-center gap-3">
              <LikeButton 
                initialLikes={blog?.likes || 0}
                initialLiked={blog?.isLiked || false}
                blogId={blog?._id || ''}
                size="sm"
                clickable={true}
                withNumber={false}
              />
              
              <button
                className="p-2 rounded-full transition-all duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <Bookmark className="w-5 h-5" />
              </button>

              <div className="relative">
                <button
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                
                <AnimatePresence>
                  {false && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[160px] z-50"
                    >
                      <button
                        className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <Twitter className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-700">Twitter</span>
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <Facebook className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700">Facebook</span>
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <LinkIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">Copy Link</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
              {blog?.tags || 'General'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {blog?.title || 'Blog Title'}
          </h1>

          {/* Author Section */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center overflow-hidden">
                {author.avatar}
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{ author.username }</h3>
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {blog?.createdAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {blog?.readTime || '5 min read'}
                  </span>
                </div>
              </div>
            </div>

            <button
              className="px-6 py-2 rounded-full font-semibold transition-all duration-200 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
            >
              Follow
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-600 pb-6 border-b border-gray-200">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {blog?.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {blog?.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {blog?.comments || 0}
            </span>
          </div>
        </motion.header>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-full h-64 md:h-96 bg-gray-200 rounded-xl shadow-lg">
            <img src={blog?.coverImage} className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg" alt={blog?.title} />
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="prose prose-lg max-w-none"
          style={{
            fontSize: '18px',
            lineHeight: '1.8',
            color: '#374151'
          }}
        >
          <div
            dangerouslySetInnerHTML={{ __html: blog?.content || '<p>Loading content...</p>' }}
            className="blog-content"
            style={{
              fontSize: '18px',
              lineHeight: '1.8',
              color: '#374151'
            }}
          >
          </div>
        </motion.div>

        {/* Article Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          {/* Engagement Actions */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              {/* Like Button */}
              <LikeButton
                initialLikes={blog?.likes}
                initialLiked={blog?.isLiked}
                onLikeChange={(liked, count) => console.log('Liked:', liked, 'Count:', count)}
                blogId={blog?._id || ''}
                size="md"
              />

              {/* Comments Button */}
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">12</span>
              </button>
            </div>

            <button
              className="p-3 rounded-full transition-all duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <Bookmark className="w-5 h-5" />
            </button>
          </div>

          {/* Author Bio */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                <User className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-xl font-bold text-gray-900">Author Name</h4>
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                </div>
                
                <p className="text-gray-600 mb-3">This is a sample author bio that describes the author.</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span>1,000 followers</span>
                  <span>200 following</span>
                </div>
                
                <button
                  className="px-6 py-2 rounded-full font-semibold transition-all duration-200 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                >
                  Follow
                </button>
              </div>
            </div>
          </div>
        </motion.footer>
      </article>
    </div>
  );
};

export default ReadBlog;