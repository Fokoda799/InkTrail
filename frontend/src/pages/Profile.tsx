import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EditProfile from '../components/EditProfile';
import { Link, useNavigate } from 'react-router-dom';
import { Blog } from '../types/blogTypes';
import { useAuth } from '../hooks/useAuth';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!user) {
    return null;
  }

  console.log(user)

  return (
    <Container maxWidth="md" sx={{ marginTop: '2rem' }}>
      {/* Profile Header Section */}
      <Paper elevation={3} sx={{ padding: '2rem', marginBottom: '2rem' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <Stack direction="row" spacing={1}>
              <Avatar 
                sx={{ width: 120, height: 120 }} 
                src={user.avatar || undefined}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h5" gutterBottom>
                {user.username}
              </Typography>
              <IconButton aria-label="edit profile" onClick={handleClick}>
                <EditIcon />
              </IconButton>
            </Box>
            <Typography variant="body1" color="textSecondary">
              @{user.username}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ marginTop: '0.5rem' }}>
              {user.bio || 'No bio available'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Edit Profile Component */}
      <EditProfile open={open} handleClose={handleClose} />

      {/* Stats Section */}
      <Paper elevation={1} sx={{ marginBottom: '2rem', padding: '1rem' }}>
        <Grid container spacing={2}>
          <Grid item xs={4} textAlign="center">
            <Typography variant="h6">Blogs</Typography>
            <Typography variant="h5" color="primary">{user?.blogs?.length || 0}</Typography>
          </Grid>
          <Grid item xs={4} textAlign="center">
            <Typography variant="h6">Followers</Typography>
            <Typography variant="h5" color="primary">{user?.followers?.length || 0}</Typography>
          </Grid>
          <Grid item xs={4} textAlign="center">
            <Typography variant="h6">Following</Typography>
            <Typography variant="h5" color="primary">{user?.following?.length || 0}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* My Blogs Section */}
      <Paper elevation={1} sx={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <Typography variant="h6" gutterBottom>
          My Blogs
        </Typography>
        {user.blogs && user.blogs.length === 0 ? (
          <Stack spacing={1} display="flex" justifyContent="center" alignItems="center">
            <Typography variant="body1" sx={{ margin: 'auto' }}>
              Post your first blog today!
            </Typography>
            <Button
              component={Link}
              to="/create"
              variant="contained"
              color="primary"
              size="small"
            >
              Write
            </Button>
          </Stack>
        ) : (
          <Grid container spacing={2}>
            {user.blogs?.map((blog: Blog) => (
              <Grid item xs={12} sm={6} key={blog._id}
              onClick={() => navigate(`/edit-blog/${blog._id}`)}>
                <Paper elevation={0} sx={{ cursor: 'pointer', padding: '1rem' }}>
                  <img
                    src={blog.image || '/default-image.jpg'}
                    alt={blog.title}
                    style={{ width: '100%', height: '200px', borderRadius: '4px' }}
                  />
                  <Box sx={{ marginTop: '1rem' }}>
                    <Typography variant="h6" gutterBottom>
                      {blog.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {blog.content && blog.content.length > 50
                        ? `${blog.content.substring(0, 50)}...`
                        : blog?.content || 'No content available'}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default Profile;
