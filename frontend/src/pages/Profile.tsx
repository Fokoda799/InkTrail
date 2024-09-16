import React from 'react';
import {
  Avatar,
  Box,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAppSelector } from '../redux/hooks';
import { selectUserState } from '../redux/reducers/userReducer';
import EditProfile from '../components/EditProfile';
import { Link } from 'react-router-dom';
import { Blog } from '../types/blogTypes';

const Profile = () => {
  const { currentUser } = useAppSelector(selectUserState);
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!currentUser) {
    return (
      <Container maxWidth="md">
        <Typography variant="h5" align="center" sx={{ marginTop: '2rem' }}>
          Please login to view your profile
        </Typography>
      </Container>
    );
  }

  console.log(currentUser);

  return (
    <Container maxWidth="md" sx={{ marginTop: '2rem' }}>
      {/* Profile Header Section */}
      <Paper elevation={3} sx={{ padding: '2rem', marginBottom: '2rem' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <Stack direction="row" spacing={1}>
              {currentUser.avatar ? (
                <Avatar sx={{ width: 120, height: 120 }} src={currentUser.avatar} />
              ) : (
                <Avatar sx={{ width: 120, height: 120 }}>{currentUser.username[0].toUpperCase()}</Avatar>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h5" gutterBottom>
                {currentUser.fullName}
              </Typography>
              <IconButton aria-label="edit profile" onClick={handleClick}>
                <EditIcon />
              </IconButton>
            </Box>
            <Typography variant="body1" color="textSecondary">
              @{currentUser.username}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ marginTop: '0.5rem' }}>
              {currentUser.bio}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <EditProfile open={open} handleClose={handleClose} />

      {/* Stats Section */}
      <Paper elevation={1} sx={{ marginBottom: '2rem', padding: '1rem' }}>
        <Grid container spacing={2}>
          <Grid item xs={4} textAlign="center">
            <Typography variant="h6">Posts</Typography>
            <Typography variant="h5" color="primary">120</Typography>
          </Grid>
          <Grid item xs={4} textAlign="center">
            <Typography variant="h6">Followers</Typography>
            <Typography variant="h5" color="primary">2.5k</Typography>
          </Grid>
          <Grid item xs={4} textAlign="center">
            <Typography variant="h6">Following</Typography>
            <Typography variant="h5" color="primary">180</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* My Blogs Section */}
      <Paper elevation={1} sx={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <Typography variant="h6" gutterBottom>
          My Blogs
        </Typography>
        {currentUser?.blogs?.length === 0 ? (
          <Stack spacing={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <Typography variant="body1" sx={{ margin: 'auto' }}>
            Post your first blog today!
          </Typography>
          <Typography variant="body1" component={Link} to="/create">
            Write
          </Typography>
        </Stack>
        ) : (
          <Grid container spacing={2}>
            {currentUser?.blogs?.map((blog: Blog) => (
              <Grid item xs={12} sm={6} key={blog._id}>
                <Paper elevation={0} sx={{ padding: '1rem', cursor: 'pointer' }}>
                  <Typography variant="h6" gutterBottom>
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {blog.content.substring(0, 20)}
                  </Typography>
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
