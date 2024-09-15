import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import FollowersIcon from '@mui/icons-material/People';
import FollowingIcon from '@mui/icons-material/PersonAdd';
import { useAppSelector } from '../redux/hooks';
import { selectUserState } from '../redux/reducers/userReducer';

const Profile = () => {
  const {currentUser, isAuth } = useAppSelector(selectUserState);
  if (!isAuth) {
    return (
      <Container maxWidth="md">
        <Typography variant="h5" align="center" sx={{ marginTop: '2rem' }}>
          Please login to view your profile
        </Typography>
      </Container>
    );
  }
  return (
    <Container maxWidth="md" sx={{ marginTop: '2rem' }}>
      {/* Profile Header Section */}
      <Paper elevation={3} sx={{ padding: '2rem' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <Stack direction="row" spacing={2}>
              <Avatar sx={{ width: 120, height: 120, margin: 'auto' }}
              >{currentUser.username.charAt(0).toUpperCase()}
              </Avatar>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h5" gutterBottom>
                {currentUser.fullName}
              </Typography>
              <IconButton aria-label="edit profile">
                <EditIcon />
              </IconButton>
            </Box>
            <Typography variant="body1" color="textSecondary">
              @{currentUser.username}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ marginTop: '0.5rem' }}>
              Passionate developer with a love for creating web experiences. Always learning.
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Section */}
      <Paper elevation={1} sx={{ marginTop: '2rem', padding: '1rem' }}>
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

      {/* Personal Information Section */}
      <Paper elevation={1} sx={{ marginTop: '2rem', padding: '1.5rem' }}>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <Stack spacing={2}>
          <Box display="flex" alignItems="center">
            <EmailIcon color="action" sx={{ marginRight: '0.5rem' }} />
            <Typography variant="body1">{currentUser.email}</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <LocationOnIcon color="action" sx={{ marginRight: '0.5rem' }} />
            <Typography variant="body1">San Francisco, CA</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <FollowersIcon color="action" sx={{ marginRight: '0.5rem' }} />
            <Typography variant="body1">Followers: 2500</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <FollowingIcon color="action" sx={{ marginRight: '0.5rem' }} />
            <Typography variant="body1">Following: 180</Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Edit Profile Button */}
      <Box sx={{ marginTop: '2rem', textAlign: 'center' }}>
        <Button variant="contained" color="primary" startIcon={<EditIcon />}>
          Edit Profile
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;
