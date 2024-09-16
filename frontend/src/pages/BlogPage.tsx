import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Blog } from '../types/blogTypes';
import { fetchBlogs } from '../actions/blogAction';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectBlogState } from '../redux/reducers/blogReducer';

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
      <Typography variant="h4" gutterBottom>
        Blogs
      </Typography>
      <Grid container spacing={2}>
        {blogList.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog._id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                height="140"
                image={blog.image}
                alt={blog.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {blog.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {blog.content}
                </Typography>
                <Button variant="contained" color="primary" onClick={() => navigate(`/blog/@${blog?.userId?.username}/${blog._id}`)}>
                  Read More
                </Button>
              </CardContent>
            </Card>
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
