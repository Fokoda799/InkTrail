import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Popover, 
  Typography, 
  Avatar, 
  Stack, 
  Backdrop 
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { selectUserState } from '../redux/reducers/userReducer';
import { useAppSelector } from '../redux/hooks';

interface EditProfileProps {
  open: boolean;
  handleClose: () => void;
}

export default function EditProfile({ open, handleClose }: EditProfileProps) {
  const { currentUser } = useAppSelector(selectUserState);

  // State to store user inputs
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  // Handle form submission (example, add your own logic to save the data)
  const handleSubmit = () => {
    console.log('Updated Info:', { username, bio, profileImage });
    handleClose();
  };

  return (
    <>
      {/* Backdrop with blur effect */}
      <Backdrop
        open={open}
        sx={{ 
          zIndex: 1,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(5px)',
        }}
      />
      
      {/* Popover in the center */}
      <Popover
        id="edit-profile-popover"
        open={open}
        onClose={handleClose}
        anchorReference="none" // Ensure the popover is not anchored to a specific element
        PaperProps={{
          sx: {
            position: 'fixed',
            top: '67px',
            left: '389.5px',
            transform: 'translate(-50%, -50%)', // Center it horizontally and vertically
            width: '500px',
            padding: '1rem',
            zIndex: 2, // Ensure popover appears above backdrop
          }
        }}
      >
        <Box>
          <Typography variant="h6" gutterBottom>
            Edit Profile
          </Typography>
          
          {/* Profile Image Section */}
          <Stack direction="column" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            {currentUser.avatar ? (
              <Avatar
                  src={currentUser.avatar}
                  sx={{ width: 56, height: 56 }}
                  alt="Profile Image"
              />
              ) : (
              <Avatar sx={{ width: 56, height: 56 }}>
                {currentUser.username[0].toUpperCase()}
              </Avatar>
            )}
            <Button
              variant="contained"
              component="label"
              startIcon={<PhotoCameraIcon />}
            >
              Update Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
          </Stack>
          
          {/* Username Input */}
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          {/* Bio Input */}
          <TextField
            fullWidth
            label="Bio"
            multiline
            rows={3}
            variant="outlined"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          {/* Save Button */}
          <Button variant="contained" fullWidth onClick={handleSubmit}>
            Save Changes
          </Button>
        </Box>
      </Popover>
    </>
  );
}
