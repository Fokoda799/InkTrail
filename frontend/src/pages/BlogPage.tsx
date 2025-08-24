import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
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
import SearchBar from '../components/AppComponents/SearchBar';

const BlogsPage: React.FC = () => {
  const navigate = useNavigate();
  const { blogs, pagination, isLoading, error, refreshBlogs, getBlogById } = useData();
  const alert = useAlert();
  
  // Use ref to track if we're currently fetching to prevent duplicate requests
  const isFetchingRef = useRef<boolean>(false);

  const [blogList, setBlogList] = useState<Blog[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [viewType, setViewType] = useState<'feeds' | 'following'>('feeds');
  const [sortBy, setSortBy] = useState<'latest' | 'trending' | 'popular'>('latest');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const popularTags = ['writing-tips', 'storytelling', 'poetry', 'fiction', 'non-fiction', 'characters', 'plot', 'dialogue'];

  const getBlogs = useCallback(async (pageNum: number) => {
    // Prevent duplicate requests
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    
    if (pageNum > 1) {
      setLoadingMore(true);
    }
    
    try {
      await refreshBlogs(viewType, pageNum, sortBy, selectedTags);
      
      // The blogs from context should contain the new page data
      // We'll handle the accumulation in the useEffect below
      
    } catch (error) {
      console.error('Error fetching blogs:', error);
      alert.error('Failed to load blogs');
    } finally {
      isFetchingRef.current = false;
      setLoadingMore(false);
    }
  }, [viewType, sortBy, page, selectedTags]);

  // Handle blogs data from context
  useEffect(() => {
    if (!blogs || blogs.length === 0) {
      if (page === 1) {
        setBlogList([]);
      }
      return;
    }

    // If this is the first page or we've changed filters, replace the list
    if (page === 1) {
      setBlogList(blogs);
    } else {
      // For subsequent pages, append new blogs (avoid duplicates)
      setBlogList(prevList => {
        const existingIds = new Set(prevList.map(blog => blog._id));
        const newBlogs = blogs.filter(blog => !existingIds.has(blog._id));
        return [...prevList, ...newBlogs];
      });
    }

    // Determine if there are more blogs to load
    // Adjust this logic based on your API response structure
    // Common patterns:
    // 1. If API returns less than expected page size (e.g., 10), no more pages
    // 2. If API provides totalCount or hasMore field
    // 3. If API provides nextPage field
    
    const EXPECTED_PAGE_SIZE = 10; // Adjust this to match your API's page size
    setHasMore(blogs.length === EXPECTED_PAGE_SIZE);
    
  }, [blogs, page]);

  // Reset pagination when filters change
  useEffect(() => {
    setBlogList([]);
    setPage(1);
    setHasMore(true);
  }, [sortBy, viewType, selectedTags]);

  // Handle errors
  useEffect(() => {
    if (error) {
      alert.error(error);
    }
  }, [error]);

  // Initial load and when dependencies change
  useEffect(() => {
    if (page === 1) {
      getBlogs(1);
    }
  }, [getBlogs, page]);

  // Load more when page increases (but not on initial load)
  useEffect(() => {
    if (page > 1) {
      getBlogs(page);
    }
  }, [page, getBlogs]);

  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLElement;
    if (!target) return;
    
    // Check if we're near the bottom of the scroll container
    const threshold = 500;
    const scrollPosition = target.scrollTop + target.clientHeight;
    const scrollHeight = target.scrollHeight;
    
    if (
      scrollPosition >= scrollHeight - threshold &&
      !loadingMore &&
      pagination.hasNextPage
    ) {
      setPage(prevPage => prevPage + 1);
    }
  }, [pagination.hasNextPage, isLoading]);

  // Set up scroll listener on the scroll container
  useEffect(() => {
    const scrollContainer = document.getElementById('scroll-container');
    if (!scrollContainer) {
      console.warn('Scroll container not found');
      return;
    }
    
    const handleScrollThrottled = throttle(handleScroll, 200);
    
    scrollContainer.addEventListener('scroll', handleScrollThrottled, { passive: true });
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScrollThrottled);
    };
  }, [handleScroll]);

  // Simple throttle function to limit scroll event frequency
  const throttle = (func: Function, limit: number) => {
    let inThrottle: boolean;
    return function(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

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
    <div className="min-h-screen bg-gray-50" id="blogs-page">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
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
            <SearchBar clear={true} />

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
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200"
              >
                Filters
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {blogList.map((blog, index) => (
                <motion.div
                  key={`${blog._id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BlogCard blog={blog} index={index} getBlogById={getBlogById} />
                </motion.div>
              ))}
            </div>

            {/* Loading Indicator */}
            {(loadingMore || (isLoading && page > 1)) && (
              <div className="flex justify-center py-8">
                <div className="flex items-center gap-3 text-gray-600">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="font-medium">Loading more stories...</span>
                </div>
              </div>
            )}

            {/* End of Results */}
            {!hasMore && !loadingMore && !isLoading && (
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
                  {viewType === 'following'
                    ? "You've seen all stories from authors you follow."
                    : "You've seen all available stories. Check back later for more!"}
                </p>
              </motion.div>
            )}
          </>
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
              onClick={() => navigate('/new-fact')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <PenTool className="w-5 h-5" />
              Write Your First Story
            </motion.button>
          </motion.div>
        ) : (
          <div className="flex justify-center py-16">
            <div className="flex items-center gap-3 text-gray-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="font-medium">Loading amazing stories...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;