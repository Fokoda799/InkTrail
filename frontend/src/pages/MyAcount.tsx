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

const MyAccount = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    location: 'San Francisco, CA',
  });

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
              label="Full Name"
              name="name"
              value={userDetails.name}
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

          {/* Location Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Location"
              name="location"
              value={userDetails.location}
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

      {/* Update Password Section */}
      <Paper elevation={1} sx={{ marginTop: '2rem', padding: '2rem' }}>
        <Typography variant="h6" gutterBottom>
          Update Password
        </Typography>

        <Grid container spacing={3}>
          {/* Current Password */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Current Password"
              name="currentPassword"
              type="password"
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
          >
            Update Password
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default MyAccount;
