import { useCallback, useEffect } from 'react';
import { Box, Typography, Avatar, IconButton, Stack, Divider, Grid, Button, CircularProgress } from '@mui/material';
import ClapIcon from '@mui/icons-material/ThumbUpAltOutlined'; // Placeholder for clap icon
import CommentIcon from '@mui/icons-material/CommentOutlined';
import ShareIcon from '@mui/icons-material/ShareOutlined';
import SaveIcon from '@mui/icons-material/BookmarkBorder';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectBlogState } from '../redux/reducers/blogReducer';
import { fetchBlogById } from '../actions/blogAction';
import { format } from 'date-fns';
import { Blog } from '../types/blogTypes';

function BlogDetail() {
  const { blogs, loading, error } = useAppSelector(selectBlogState);
  const dispatch = useAppDispatch();
  const { id: blogId } = useParams();
  const navigate = useNavigate();
  const selectedBlog: Blog | undefined = blogs.find((blog) => blog._id === blogId);

  const fetchBlog = useCallback(async () => {
    if (!blogId) {
      navigate('/not-found');
      console.error('No blog ID found.');
      return;
    }
    try {
      await dispatch(fetchBlogById(blogId));
    } catch (err) {
      console.error('Error fetching blog:', err);
      navigate('/not-found');
    }
  }, [blogId, dispatch, navigate]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  // Handle loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Handle error state or missing blog
  if (error || !selectedBlog) {
    return <Typography variant="h6" align="center">Blog not found</Typography>;
  }

  // Fallback values for when selectedBlog is not yet fully loaded
  const blogTitle = selectedBlog?.title || 'Untitled Blog';
  const ownerAvatar = selectedBlog?.userId?.avatar || 'https://via.placeholder.com/150';
  const ownerUsername = selectedBlog?.userId?.username || 'Anonymous';
  const postedDate = selectedBlog?.createdAt
    ? format(new Date(selectedBlog.createdAt), 'MMMM dd, yyyy')
    : 'Unknown Date';

  const blog = {
    title: blogTitle,
    owner: {
      avatar: ownerAvatar,
      username: ownerUsername,
    },
    postedDate: postedDate,
    period: '5 min read',
    clapCount: selectedBlog?.claps || 0,
    commentCount: selectedBlog?.comments?.length || 0,
    image: selectedBlog?.image || 'https://via.placeholder.com/800x400',
    content: selectedBlog?.content || 'No content available.',
    relatedBlogs: selectedBlog?.userId?.blogs || [],
  };

  return (
    <Box sx={{ padding: 4, maxWidth: '900px', margin: '0 auto' }}>
      {/* Blog Title */}
      <Typography variant="h3" component="h1" gutterBottom>
        {blog.title}
      </Typography>

      {/* Blog Owner Info */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar src={blog.owner.avatar} alt={blog.owner.username} />
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {blog.owner.username}
            </Typography>
            <Button variant="outlined" size="small" sx={{ mt: 0.5 }}>
              Follow
            </Button>
          </Box>
        </Stack>

        {/* Period and Posted Date */}
        <Typography variant="body2" color="textSecondary">
          {blog.period} • {blog.postedDate}
        </Typography>
      </Stack>

      {/* Divider */}
      <Divider sx={{ my: 2 }} />

      {/* Interaction Icons */}
      <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton>
            <ClapIcon />
          </IconButton>
          <Typography>{blog.clapCount}</Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton>
            <CommentIcon />
          </IconButton>
          <Typography>{blog.commentCount}</Typography>
        </Stack>

        <IconButton>
          <ShareIcon />
        </IconButton>

        <IconButton>
          <SaveIcon />
        </IconButton>
      </Stack>

      {/* Divider */}
      <Divider sx={{ my: 2 }} />

      {/* Blog Image */}
      <Box sx={{ mb: 3 }}>
        <img src={blog.image} alt="Blog" width="100%" height="auto" style={{ borderRadius: 8 }} />
      </Box>

      {/* Blog Content */}
      <Typography variant="body1" sx={{ mb: 5, whiteSpace: 'pre-line' }}>
        {blog.content}
      </Typography>

      {/* Related Blogs Section */}
      <Typography variant="h6" component="h2" gutterBottom>
        More blogs by {blog.owner.username}
      </Typography>

      <Grid container spacing={2}>
        {blog.relatedBlogs.map((relatedBlog) => (
          <Grid item xs={12} sm={6} key={relatedBlog._id}>
            <Button
              variant="outlined"
              fullWidth
              component="a"
              href={`/blog/@${relatedBlog.userId?.username}/${relatedBlog._id}`}
              sx={{ textAlign: 'left' }}
            >
              {relatedBlog.title}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default BlogDetail;
