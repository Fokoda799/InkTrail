import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Stack,
  Divider,
  Button,
  CircularProgress,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectBlogState } from '../redux/reducers/blogReducer';
import { fetchBlogById, likeBlog } from '../actions/blogAction';
import { followUser } from '../actions/userAction';
import { format } from 'date-fns';
import { RootState } from '../redux/store';

function BlogDetail() {
  const { likes, selectedBlog, loading, error } = useAppSelector(selectBlogState);
  const { currentUser } = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const { id: blogId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [variant, setVariant] = useState<'text' | 'outlined' | 'contained'>('contained');
  const [follow, setFollow] = useState('Follow');
  const [likeIcon, setLikeIcon] = useState(<ThumbUpOutlinedIcon />);
  const [likeCount, setLikeCount] = useState(likes?.length || 0);

  // Fetch blog by ID
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

  // Update follow state based on current user
  const updateUser = useCallback(() => {
    if (!selectedBlog?.userId?._id || !currentUser?._id) {
      console.error('User not found.');
      return;
    }
    if (currentUser?.following.includes(selectedBlog.userId._id)) {
      setFollow('Following');
      setVariant('outlined');
    } else {
      setFollow('Follow');
      setVariant('contained');
    }
  }, [selectedBlog, currentUser]);

  // Update like icon based on current user's likes
  const updateBlog = useCallback(() => {
    if (!currentUser?._id || !likes) {
      console.error('Blog not found or likes not available.');
      return;
    }
    if (likes.includes(currentUser._id)) {
      setLikeIcon(<ThumbUpIcon />);
    } else {
      setLikeIcon(<ThumbUpOutlinedIcon />);
    }
  }, [likes, currentUser]);

  useEffect(() => {
    fetchBlog(); // Fetch blog initially
  }, [fetchBlog]);

  useEffect(() => {
    updateUser();
  }, [updateUser]);

  useEffect(() => {
    updateBlog();
  }, [updateBlog]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !selectedBlog) {
    return <Typography variant="h6" align="center">Blog not found</Typography>;
  }

  // Toggle follow/unfollow logic
  const handleFollowToggle = async () => {
    setFollow('Processing...');
    if (!selectedBlog?.userId?._id) {
      console.error('No user ID found.');
      return;
    }

    try {
      await dispatch(followUser(selectedBlog.userId._id));

      setFollow((prevFollow) => (prevFollow === 'Follow' ? 'Following' : 'Follow'));
      setVariant((prevVariant) => (prevVariant === 'contained' ? 'outlined' : 'contained'));
    } catch (error) {
      console.error('Error following user:', error);
      setFollow('Follow'); // Revert state on failure
    }
  };

  // Like/Unlike blog post
  const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!selectedBlog?._id) {
      console.error('No blog ID found.');
      return;
    }

    try {
      await dispatch(likeBlog(selectedBlog._id));

      // Optimistically update the like icon and count
      setLikeIcon((prevIcon) =>
        prevIcon.type === ThumbUpOutlinedIcon ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />
      );
      setLikeCount((prevCount) =>
        likeIcon.type === ThumbUpOutlinedIcon ? prevCount + 1 : prevCount - 1
      );
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

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
    postedDate,
    period: '5 min read',
    likeCount,
    commentCount: selectedBlog?.comments?.length || 0,
    image: selectedBlog?.image || 'https://via.placeholder.com/800x400',
    content: selectedBlog?.content || 'No content available.',
    comments: selectedBlog?.comments || [],
  };

  return (
    <Box sx={{ padding: 4, maxWidth: '700px', margin: '0 auto' }}>
      <Typography variant="h3" component="h1" gutterBottom>{blog.title}</Typography>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar src={blog.owner.avatar} alt={blog.owner.username} />
          <Box>
            <Typography variant="body2">{blog.owner.username}</Typography>
            <Button variant={variant} sx={{ mt: 0.5, height: 25, width: 80, fontSize: 10 }} onClick={handleFollowToggle}>
              {follow}
            </Button>
          </Box>
        </Stack>
        <Typography variant="body2" color="textSecondary">{blog.period} • {blog.postedDate}</Typography>
      </Stack>

      <Divider sx={{ my: 2 }} />
      <Box sx={{ mb: 3 }}>
        <img src={blog.image} alt="Blog" width="100%" height="auto" style={{ borderRadius: 8 }} />
      </Box>

      <Typography variant="body1" sx={{ mb: 5, whiteSpace: 'pre-line' }}>{blog.content}</Typography>
      <Divider sx={{ mb: 2 }} />

      <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} onClick={handleLike}>
          <IconButton>{likeIcon}</IconButton>
          <Typography>{blog.likeCount}</Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

export default BlogDetail;
