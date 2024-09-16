import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectUserState } from '../redux/reducers/userReducer';
import { updatePassword } from '../actions/userAction';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { currentUser, error } = useAppSelector(selectUserState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState({
    username: currentUser?.username,
    email: currentUser?.email,
    currentPassword: '',
    newPassword: ''
  });
  const [label, setLabel] = useState('Current Password');

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  // Toggle Edit Mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Handle Update Password
  const handleUpdatePassword = () => {
    if (!userDetails.currentPassword || !userDetails.newPassword) {
      setLabel('Please enter both current and new passwords');
      return;
    }
    
    dispatch(updatePassword(userDetails.newPassword, userDetails.currentPassword));
    
    if (error) {
      setLabel(error);
      return;
    }
    
    navigate('/profile');
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: '2rem' }}>
      {/* Account Info Section */}
      <Paper elevation={3} sx={{ padding: '2rem' }}>
        <Typography variant="h5" gutterBottom>
          Account Information
        </Typography>

        <Divider sx={{ marginY: '1.5rem' }} />

        <Grid container spacing={3}>
          {/* Name Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Username"
              name="username"
              value={userDetails.username}
              onChange={handleInputChange}
              fullWidth
              disabled={!isEditing}
            />
          </Grid>

          {/* Email Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email Address"
              name="email"
              value={userDetails.email}
              onChange={handleInputChange}
              fullWidth
              disabled={!isEditing}
            />
          </Grid>
        </Grid>

        {/* Edit and Save Button */}
        <Box sx={{ marginTop: '2rem', textAlign: 'center' }}>
          <Button
            variant={isEditing ? 'contained' : 'outlined'}
            color={isEditing ? 'primary' : 'secondary'}
            startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
            onClick={toggleEditMode}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </Box>
      </Paper>

      {/* Update Password Section - Only show if currentUser has a password */}
      {currentUser?.password && (
        <Paper elevation={1} sx={{ marginTop: '2rem', padding: '2rem' }}>
          <Typography variant="h6" gutterBottom>
            Update Password
          </Typography>

          <Grid container spacing={3}>
            {/* Current Password */}
            <Grid item xs={12} sm={6}>
              <TextField
                label={label}
                name="currentPassword"
                type="password"
                value={userDetails.currentPassword}
                onChange={handleInputChange}
                fullWidth
                disabled={!isEditing}
              />
            </Grid>

            {/* New Password */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="New Password"
                name="newPassword"
                type="password"
                value={userDetails.newPassword}
                onChange={handleInputChange}
                fullWidth
                disabled={!isEditing}
              />
            </Grid>
          </Grid>

          {/* Save Password Button */}
          <Box sx={{ marginTop: '2rem', textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<LockIcon />}
              disabled={!isEditing}
              onClick={handleUpdatePassword}
            >
              Update Password
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default Settings;
