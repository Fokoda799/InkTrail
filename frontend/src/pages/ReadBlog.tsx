import React, { useEffect } from 'react';
import './styles/RaedBlog.css'; 
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Blog, BlogResponse, ErrorResponse } from '../types/blogTypes';
import { useAppSelector } from '../redux/hooks';
import { selectUserState } from '../redux/reducers/userReducer';
import { UserResponse } from '../types/userTypes';

const RaedBlog: React.FC = () => {
  const { me } = useAppSelector(selectUserState);
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = React.useState<Blog | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>('');
  const [follow, setFollow] = React.useState<boolean>(false);


  const fetchBlog = async (id: string | undefined) => {
    setLoading(true);
    try {
      const { data }: { data: BlogResponse | ErrorResponse } = await axios.get(`/api/v1/blog/${id}`);
      if (!data.success) throw new Error(data.message);
      setBlog(data.blog);
      console.log(data.blog?.author?.followers);
      if (data.blog?.author?.followers && me?._id) {
        setFollow(!data.blog.author.followers.includes(me?._id));
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error fetching blog');
    } finally {
      setLoading(false);
    }
  };

  const followUser = async (id: string | undefined) => {
    if (!id) return;
    setLoading(true);
    try {
      const { data }: { data: UserResponse | ErrorResponse } = await axios.put(`/api/v1/user/follow/${id}`);
      if (!data.success) throw new Error(data.message);
      setFollow(data.isFollowing); // Toggle follow state
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error following user');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBlog(id);
  }, [id]);

  const handleClick = async () => {
    if (me?._id === blog?.author?._id) {
      alert('You cannot follow yourself');
      return;
    }
    
    followUser(blog?.author?._id).then(() => {
      console.log('Follow user:', follow);
    })
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!blog) {
    return <div>No blog found.</div>;
  }

  return (
    <div className="blog-page">
      <div className="blog-header">
        <div className="blog-category">NATURE</div>
        <h1 className="blog-title">{blog.title}</h1>
        <p className="blog-subtitle">A philanthropist and local government have protected this gem</p>
        <div className="blog-author-section">
          <img src={blog.author?.avatar} alt="Author" className="author-image" />
          <div className="author-details">
            <div className='author'>
              <span className="author-name">{blog.author?.username}</span> •  
              <span className={follow ? 'Unfollow' : 'Follow'} onClick={handleClick}>
                {follow ? 'Unfollow' : 'Follow'}
              </span>
            </div> 
            <span className="author-info">Published in Simply Wild • 5 min read • 3 days ago</span>
          </div>
        </div>
      </div>

      <div className="blog-content">
        <img src={blog.image} alt="Blog" className="blog-main-image" />
        <p>{blog.content}</p>
      </div>
      <div className="actions">
        {/* Add any additional actions or buttons here */}
      </div>
    </div>
  );
};

export default RaedBlog;
