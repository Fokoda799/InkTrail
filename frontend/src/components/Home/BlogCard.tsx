import { motion } from "framer-motion";
import { Blog } from "../../types/blogTypes";
import { useNavigate } from "react-router-dom";
import { Clock, MessageCircle, User } from "lucide-react";
import LikeButton from "../BlogPage/Like";
import useToProfile from "../../hooks/useToProfile";
import { useData } from "../../context/dataContext";
import { useEffect, useState } from "react";


export const BlogCard: React.FC<{ blog: Blog; index: number; getBlogById: (id: string) => Promise<Blog | null | undefined> }> = ({ blog, index, getBlogById }) => {
  const navigate = useNavigate();
  const { toProfile } = useToProfile(blog.author._id || '');
  const { CommentActions } = useData();

  const [commentCount, setCommentCount] = useState<number>(0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleClick = async () => {
    await getBlogById(blog._id);
    navigate(`/blog/${blog._id}`);
  }

  useEffect(() => {
    const getCount = async () => {
      const count = await CommentActions.getCommentCount(blog._id);
      setCommentCount(count);
    }
    getCount();
  }, [blog._id, CommentActions.getCommentCount]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={handleClick}
      className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-amber-200"
    >
      {/* Cover Image */}
      {blog.coverImage && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={blog.coverImage} 
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      
      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.tags.slice(0, 2).map(tag => (
              <span 
                key={tag}
                className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
            {blog.tags.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                +{blog.tags.length - 2}
              </span>
            )}
          </div>
        ) : (
          <div className="mb-3">
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
            </span>
          </div>
        )}
        
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-600 transition-colors duration-200">
          {blog.title}
        </h3>
        
        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {blog.excerpt || "Discover valuable lessons, career advice, and practical steps to advance your journey in the tech industry."}  <br/> <br/>
          
        </p> 
        
        {/* Author & Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              onClick={toProfile}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center overflow-hidden">
              {blog.author.avatar ? (
                <img 
                  src={blog.author.avatar} 
                  alt={blog.author.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{blog.author.username}</p>
              <p className="text-xs text-gray-500">{formatDate(blog.createdAt)}</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-4 text-s text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{blog.readTime}m</span>
            </div>
            <div className="flex items-center">
              <LikeButton
                initialLikes={blog.likes}
                initialLiked={blog.isLiked}
                blogId={blog._id}
                size="sm"
                clickable={false}
                style="text-gray-500 gap-1"
                active={false}
              />
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};