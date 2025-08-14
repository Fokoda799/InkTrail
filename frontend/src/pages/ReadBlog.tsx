import React, { useState, useEffect, } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Calendar, Heart, MessageCircle, Share2, 
  User, Eye,
  CheckCircle, AlertCircle, Loader2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../context/dataContext';
import CommentSection from '../components/BlogPage/CommentModal';
import type { Blog } from '../types/blogTypes';
import LikeButton from '../components/BlogPage/Like';
import BookMarkButton from '../components/BlogPage/BookMarkButton';
import FollowButton from '../components/BlogPage/FollowButton';
import useToProfile from '../hooks/useToProfile';
import { BlogContent } from '../components/WriteBlog/BlogContent';
import ShareDropDown from '../components/AppComponents/ShareDropDown';

const BlogReader: React.FC = () => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readProgress, setReadProgress] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [highlightComment, setHighlightComment] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { blog: initBlog, getBlogById, CommentActions, setAction } = useData();
  const { id: blogId } = useParams<{ id: string }>();
  const { toProfile } = useToProfile(blog?.author?.username || '');
  const me = user?._id === blog?.author?._id;
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);  // 
  const subpath = pathParts[pathParts.length - 1];
  const hashText = location.hash.replace(/^#/, ''); // ✅ works


  // Load blog data
  useEffect(() => {
    if (!blogId) {
      setError('Blog ID is required');
      setIsLoading(false);
      return;
    }
    const loadBlog = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const blogData = await getBlogById(blogId || blog?._id || '');
        const count = await CommentActions.getCommentCount(blogId || blog?._id || '');

        console.log('Loaded blog:', blogData);
        console.log('Comment count:', count);

        if (!blogData) {
          setError('Blog not found');
          return;
        }
        
        setBlog(blogData);
        setCommentCount(count);
      } catch (err) {
        setError('Failed to load blog');
        console.error('Error loading blog:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBlog();
  }, [blogId]);

  useEffect(() => {
    if (subpath === 'comment' && hashText) {
      setCommentOpen(true);

      // Wait a bit for DOM to render the comment section
      const timer = setTimeout(() => {
        const commentEl = document.getElementById(hashText);
        if (commentEl) {
          commentEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setHighlightComment(true); // start highlight after scroll
        }
      }, 300); // adjust delay to match drawer animation speed

      // Reset the path without reloading after some time
      const resetTimer = setTimeout(() => {
        navigate(`/blog/${blogId}`, { replace: true });
      }, 3000);

      return () => {
        clearTimeout(timer);
        clearTimeout(resetTimer);
      };
    }
  }, [subpath, hashText, blogId, navigate]);





  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const article = document.querySelector('article');
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const articleHeight = rect.height;
      const scrolled = Math.max(0, -rect.top);
      const maxScroll = articleHeight - viewportHeight;
      
      if (maxScroll > 0) {
        const progress = Math.min(100, (scrolled / maxScroll) * 100);
        setReadProgress(progress);
      }
    };
    const scrollContainer = document.getElementById('scroll-container') || window;

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        if (localStorage.getItem(`viewedBlog-${blogId || blog?._id || ''}`)) return;
        await setAction(blogId || blog?._id || '', 'view');
        // store the view state in the local storage
        localStorage.setItem(`viewedBlog-${blogId || blog?._id || ''}`, 'true');
        console.log('View action set for blog:', blogId || blog?._id || '');
      } catch (err) {
        alert(error)
      }
    }, 10000); // 30 seconds

    // Cleanup if the user leaves early
    return () => clearTimeout(timer);
  }, [blogId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading && !blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
        <p className="text-gray-600 text-lg">Loading blog post...</p>
      </div>
    );
  }

  if (error || !blog || !blogId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-gray-600 text-lg">{error || 'Blog not found'}</p>
        <button onClick={() => window.history.back()} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-150 ease-out"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Navigation Header */}
      <div className="relative bg-white/95 backdrop-blur-sm border-b border-gray-200 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back</span>
            </button>
            
            <div className="flex items-center gap-2">
              <LikeButton 
                blogId={initBlog?._id || blog._id}
                initialLikes={initBlog?.likes}
                initialLiked={initBlog?.isLiked}
                withNumber ={false}
                style="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
              />
              
              <BookMarkButton 
                blogId={initBlog?._id || blog._id}
                initialBookmarked={initBlog?.isBookmarked}
                style="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
              />

              <div className="relative">
                <button
                  onClick={() => setShareOpen(!shareOpen)}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
                >
                  <Share2 
                    className={`w-5 h-5
                    ${shareOpen ? 'text-amber-500' : ''}`}
                  />
                </button>
                
                {shareOpen && (
                  <ShareDropDown setShareOpen={setShareOpen} text={blog?.title} />
                )}
              </div>
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

      {/* Main Content */}
      <article className="my-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto scroll-container">
        {/* Article Header */}
        <header className="mb-8 animate-in slide-in-from-bottom-4 duration-700">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags?.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full hover:bg-amber-200 transition-colors duration-200"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {blog.title}
          </h1>

          {/* Author Section */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div 
                onClick={toProfile}
                className="w-12 h-12 cursor-pointer rounded-full overflow-hidden ring-2 ring-amber-200 hover:ring-amber-300 transition-all duration-200 flex-shrink-0">
                {blog.author?.avatar ? (
                  <img 
                    src={blog.author.avatar} 
                    alt={blog.author.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">
                    {blog.author?.username}
                  </h3>
                  {blog.author?.isVerified && (
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(blog.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {blog.readTime}
                  </span>
                </div>
              </div>
            </div>

            {!me && (
              <FollowButton 
                authorId={initBlog?.author?._id || blog.author._id}
                initialFollowed={initBlog?.author?.isFollowed}
                initialFollows={initBlog?.author?.follows?.length || 0}
                style="px-6 py-2 rounded-full font-medium bg-amber-500 text-white hover:bg-amber-600 hover:shadow-lg transition-all duration-200"
              />
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-600 pb-6 border-b border-gray-200">
            <span className="flex items-center gap-1 hover:text-gray-900 transition-colors duration-200">
              <Eye className="w-4 h-4" />
              {blog.views?.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 hover:text-gray-900 transition-colors duration-200">
              <Heart className="w-4 h-4" />
              {blog.likes?.toLocaleString() || 0}
            </span>
            <span className="flex items-center gap-1 hover:text-gray-900 transition-colors duration-200">
              <MessageCircle className="w-4 h-4" />
              {commentCount}
            </span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-8 animate-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="w-full h-64 md:h-96 bg-gray-200 rounded-xl overflow-hidden shadow-lg">
            <img 
              src={blog.coverImage || 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
              alt={blog.title} 
            />
          </div>
        </div>

        <div className="w-full max-w-screen-lg mx-auto animate-in slide-in-from-bottom-4 duration-700 delay-300 overflow-x-hidden">
          <BlogContent
            htmlContent={blog.content} 
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed break-words overflow-hidden"
            style={{
              fontSize: '18px',
              lineHeight: '1.8',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          />
        </div>


        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 animate-in slide-in-from-bottom-4 duration-700 delay-500">
          {/* Engagement Actions */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <LikeButton 
                blogId={initBlog?._id || blog._id}
                initialLikes={initBlog?.likes}
                initialLiked={initBlog?.isLiked}
                style="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
              />

              <button
                onClick={() => setCommentOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">{commentCount}</span>
              </button>
            </div>

            <BookMarkButton 
                blogId={initBlog?._id || blog._id}
                initialBookmarked={initBlog?.isBookmarked}
                style="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
              />
          </div>

          {/* Author Bio */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
            <div className="flex items-start gap-4">
              <div 
                onClick={toProfile}
                className="w-16 h-16 cursor-pointer rounded-full overflow-hidden ring-2 ring-amber-200 hover:ring-amber-300 transition-all duration-200 flex-shrink-0">
                {blog.author?.avatar ? (
                  <img 
                    src={blog.author.avatar} 
                    alt={blog.author.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-xl font-bold text-gray-900">
                    {blog.author?.username}
                  </h4>
                  {blog.author?.isVerified && (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                
                <p className="text-gray-600 mb-3">{blog.author?.bio || 'No bio available'}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span>{initBlog?.author?.follows || blog?.author?.follows?.length || 0} followers</span>
                </div>
                
                {!me && (
                  <FollowButton 
                    authorId={initBlog?.author?._id || blog.author._id}
                    initialFollowed={initBlog?.author?.isFollowed}
                    initialFollows={initBlog?.author?.follows?.length || 0}
                    style="px-6 py-2 rounded-full font-medium bg-amber-500 text-white hover:bg-amber-600 hover:shadow-lg transition-all duration-200"
                  />
                )}
              </div>
            </div>
          </div>
        </footer>
      </article>

      {/* Comment Modal */}
      <CommentSection
        blogId={blogId}
        isOpen={commentOpen}
        highlightComment={{highlightComment, hashText}}
        onClose={() => setCommentOpen(false)}
      />
    </div>
  );
};

export default BlogReader;