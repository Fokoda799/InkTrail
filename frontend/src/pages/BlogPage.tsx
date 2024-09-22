import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Blog } from '../types/blogTypes';
import { fetchBlogs, fetchFilteredBlogs } from '../actions/blogAction'; // Assume we have both actions
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectBlogState } from '../redux/reducers/blogReducer';
import BlogCard from '../components/Card';
import BasicBreadcrumbs from '../components/BasicBreadcrumbs';
import { selectUserState } from '../redux/reducers/userReducer';

const BlogsPage: React.FC = () => {
  const { blogs, pagination, loading } = useAppSelector(selectBlogState);
  const { me } = useAppSelector(selectUserState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [blogList, setBlogList] = useState<Blog[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [viewType, setViewType] = useState<'feeds' | 'following'>('feeds');

  const getBlogs = useCallback(() => {
    const action = viewType === 'feeds' ? fetchBlogs(page) : fetchFilteredBlogs(page, { following: true });
    dispatch(action);
  }, [dispatch, page, viewType]);

  useEffect(() => {
    getBlogs();
  }, [getBlogs, page]); // Adding 'page' to dependencies to refetch when it changes

  useEffect(() => {
    if (blogs.length > 0 && pagination) {
      setBlogList((prevBlogs) => {
        const newBlogs = [...prevBlogs, ...blogs];
        // Remove duplicates by mapping over the blog IDs
        return Array.from(new Set(newBlogs.map((b) => b._id))).map((id) =>
          newBlogs.find((blog) => blog._id === id)!
        );
      });
      setHasMore(pagination.currentPage < pagination.totalPages);
    } else {
      setHasMore(false);
    }
  }, [blogs, pagination]);

  const handleScroll = useCallback(() => {
    // Adding a 100px threshold for smoother scrolling
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 250 &&
      !loading &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleViewTypeChange = (newViewType: 'feeds' | 'following') => {
    if (newViewType !== viewType) {
      setViewType(newViewType);
      setBlogList([]); // Reset the blog list when switching views
      setPage(1); // Reset page to 1
      setHasMore(true); // Reset hasMore
    }
  };

  return (
    <Box sx={{ padding: 2, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Grid item sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
        <BasicBreadcrumbs setViewType={handleViewTypeChange} />
      </Grid>

      <Grid container spacing={1} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
        {blogList.map((blog) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={blog._id}
            onClick={() => navigate(`/blog/${blog.author?.username}/${blog._id}`)}
            sx={{ cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}
          >
            <BlogCard {...blog} />
          </Grid>
        ))}
      </Grid>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {!hasMore && !loading && blogList.length > 0 && (
        <Typography variant="body2" align="center" sx={{ marginTop: 3 }}>
          No more blogs to load.
        </Typography>
      )}

      {!loading && blogList.length === 0 && (
        <Typography variant="body1" align="center" sx={{ marginTop: 3 }}>
          No blogs available. {viewType === 'following' ? 'Start following some authors!' : 'Be the first to post!'}
        </Typography>
      )}
    </Box>
  );
};

export default BlogsPage;
