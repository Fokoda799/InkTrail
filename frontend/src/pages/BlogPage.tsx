import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, 
  Filter, 
  TrendingUp, 
  Users, 
  ChevronDown,
  Loader2,
  BookOpen,
  PenTool,
} from 'lucide-react';
import { BlogCard } from '../components/Home/BlogCard';
import { Blog } from '../types/blogTypes';
import { useData } from '../context/dataContext';
import { useAlert } from 'react-alert';

interface BlogsPageProps {
  // Add any props you need
}

const BlogsPage: React.FC<BlogsPageProps> = () => {
  const navigate = useNavigate();
  const { blogs, isLoading, error, refreshBlogs, getBlogById} = useData();
  const alert = useAlert();

  // Mock state - replace with your actual Redux state
  const [blogList, setBlogList] = useState<Blog[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [viewType, setViewType] = useState<'feeds' | 'following'>('feeds');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'latest' | 'trending' | 'popular'>('latest');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Mock data for demonstration
  const popularTags = ['writing-tips', 'storytelling', 'poetry', 'fiction', 'non-fiction', 'characters', 'plot', 'dialogue'];

  // Mock functions - replace with your actual API calls
  const getBlogs = useCallback(async () => {
    console.log('Fetching blogs for view type:', viewType);
    await refreshBlogs(viewType, page, sortBy);
  }, [viewType, page, sortBy]);

  useEffect(() => {
    getBlogs();
    console.log('View Type: ', viewType);
  }, [viewType, page, sortBy]);

  useEffect(() => {
    setBlogList(blogs);
  }, [blogs]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= 
      document.documentElement.offsetHeight - 250 &&
      !isLoading &&
      hasMore
    ) {
      setPage(prevPage => prevPage + 1);
    }
  }, [isLoading, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleViewTypeChange = (newViewType: 'feeds' | 'following') => {
    if (newViewType !== viewType) {
      setViewType(newViewType);
      setBlogList([]);
      setPage(1);
      setHasMore(true);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Title & Description */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Amazing{' '}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                Stories
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore a world of creativity, insights, and inspiration from our community of talented writers.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gray-100 rounded-full p-1 flex">
              <button
                onClick={() => handleViewTypeChange('feeds')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  viewType === 'feeds'
                    ? 'bg-white text-amber-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  All Stories
                </div>
              </button>
              <button
                onClick={() => handleViewTypeChange('following')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  viewType === 'following'
                    ? 'bg-white text-amber-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Following
                </div>
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stories, authors..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Sort & Filter Controls */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'latest' | 'trending' | 'popular')}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="latest">Latest</option>
                  <option value="trending">Trending</option>
                  <option value="popular">Popular</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors duration-200 ${
                  showFilters || selectedTags.length > 0
                    ? 'border-amber-500 text-amber-600 bg-amber-50'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {selectedTags.length > 0 && (
                  <span className="bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedTags.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filter Tags */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-gray-50 rounded-lg"
              >
                <h4 className="text-sm font-medium text-gray-700 mb-3">Filter by tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                        selectedTags.includes(tag)
                          ? 'bg-amber-500 text-white'
                          : 'bg-white text-gray-600 border border-gray-300 hover:border-amber-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Blog Grid */}
        {blogList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {blogList.map((blog, index) => (
              <BlogCard key={blog._id} blog={blog} index={index} getBlogById={getBlogById} />
            ))}
          </div>
        ) : !isLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {viewType === 'following' ? 'No stories from followed authors' : 'No stories found'}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {viewType === 'following' 
                ? 'Start following some authors to see their latest stories here.'
                : 'Be the first to share your story with the community!'
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/write')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
            >
              <PenTool className="w-5 h-5" />
              Write Your First Story
            </motion.button>
          </motion.div>
        ) : null}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-3 text-gray-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="font-medium">Loading amazing stories...</span>
            </div>
          </div>
        )}

        {/* End of Results */}
        {!hasMore && !isLoading && blogList.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-600 font-medium">
              You've reached the end! 🎉
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Check back later for more amazing stories.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;