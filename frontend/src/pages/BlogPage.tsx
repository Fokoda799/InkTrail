import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Blog } from '../types/blogTypes';
import { fetchBlogs } from '../actions/blogAction';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectBlogState } from '../redux/reducers/blogReducer';
import BlogCard from '../components/Card';
import BasicBreadcrumbs from '../components/BasicBreadcrumbs';

const BlogsPage = () => {
  const { blogs, pagination, loading } = useAppSelector(selectBlogState);
  const dispatch = useAppDispatch();
  const [blogList, setBlogList] = useState<Blog[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const navigate = useNavigate();

  const getBlogs = useCallback(async () => {
    dispatch(fetchBlogs(page)); // Fetch blogs with pagination
  }, [page, dispatch]);

  useEffect(() => {
    getBlogs();
  }, [getBlogs]);

  useEffect(() => {
    if (blogs.length > 0 && pagination) {
      setBlogList((prevBlogs) => [...prevBlogs, ...blogs]);
      setHasMore(pagination.currentPage < pagination.totalPages);
    } else {
      setHasMore(false);
    }
  }, [blogs, pagination]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      if (!loading && hasMore) {
        setPage((prevPage) => prevPage + 1); // Load next page
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, loading, hasMore]);

  return (
    <Box sx={{ padding: 2 }}>
      <Grid item sx={{ display: 'flex', justifyContent: 'center'}}>
        <BasicBreadcrumbs />
      </Grid>
      <Grid container spacing={-1}/>
      <Grid container spacing={2} sx={{margin: 'auto'}}>
        {blogList.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog._id}
          onClick={() => navigate(`/blog/${blog?.userId?.username}/${blog?._id}`)}>
            <BlogCard {...blog} />
          </Grid>
        ))}
      </Grid>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {!hasMore && !loading && (
        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
          No more blogs to load.
        </Typography>
      )}
    </Box>
  );
};

export default BlogsPage;
