import React from 'react';
import './styles/RaedBlog.css'; 
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Blog, BlogResponse, ErrorResponse } from '../types/blogTypes';
import LoadingSpinner from '../components/LoadingSpinner';
import Follow from '../components/Follow';
import { formatDistanceToNow } from 'date-fns';

const RaedBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = React.useState<Blog | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>('');


  const fetchBlog = async (id: string | undefined) => {
    setLoading(true);
    try {
      const { data }: { data: BlogResponse | ErrorResponse } = await axios.get(`/api/v1/blog/${id}`);
      if (!data.success) throw new Error(data.message);
      setBlog(data.blog);
      console.log(data.blog?.author?.followers);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error fetching blog');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBlog(id);
  }, [id]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!blog) {
    return <div>No blog found.</div>;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  const readingTime = Math.ceil(blog?.content.split(/\s+/).length / 200);
  const timeAgo = formatDistanceToNow(blog?.createdAt || "", { addSuffix: true });
  return (
    <div className='blog-background'>
      <div className="blog-page">
        <div className="blog-header">
          <h1 className="blog-title">{blog.title}</h1>
          <div className="blog-author-section">
            <img src={blog.author?.avatar} alt="Author" className="author-image" />
            <div className="author-details">
              <div className='author'>
                <span className="author-name">{blog.author?.username}</span> •
                <Follow targetUserId={blog?.author?._id || ''} />
              </div>
              <span className="author-info text-sm text-gray-600">
                {readingTime} min read • {timeAgo}
              </span>
            </div>
          </div>
        </div>
        <div className="blog-content">
          <img src={blog.image} alt="Blog" className="blog-main-image"/>
          <p>{blog.content}</p>
        </div>
        <div className="actions">
          {/* Add any additional actions or buttons here */}
        </div>
      </div>
    </div>
  );
};

export default RaedBlog;
