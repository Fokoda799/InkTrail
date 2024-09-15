import { useState, useRef, useEffect } from 'react';
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
import EditIcon from '@mui/icons-material/Edit';
import { selectUserState } from '../redux/reducers/userReducer';
import { useAppSelector } from '../redux/hooks';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useAppDispatch } from '../redux/hooks';
import { updateUser } from '../actions/userAction';
import { useNavigate } from 'react-router-dom';

interface EditProfileProps {
  open: boolean;
  handleClose: () => void;
}

export default function EditProfile({ open, handleClose }: EditProfileProps) {
  const { currentUser } = useAppSelector(selectUserState);
  const fileRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // State to manage hover and form inputs
  const [hover, setHover] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState<File | undefined>(undefined);
  const [avatar, setAvatar] = useState<string | undefined>(currentUser?.avatar);

  // Pre-fill user data when component opens
  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || '');
      setBio(currentUser.bio || '');
    }
  }, [currentUser]);

  // Image upload effect
  useEffect(() => {
    if (image) {
      handleUploadImage(image);
    }
  }, [image]);

  const handleUploadImage = async (image: File) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '-' + image.name;
    const storageRef = ref(storage, `avatars/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.error('Upload failed:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setAvatar(downloadURL);
        });
      },
    );
  };

  // Handle form submission
  const handleSubmit = () => {  
    dispatch(updateUser({ username, bio, avatar }));
    handleClose();
    navigate('/profile');
  };

  if (!currentUser) return null;

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
        anchorReference="none"
        PaperProps={{
          sx: {
            position: 'fixed',
            top: '67px',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '500px',
            padding: '1rem',
            zIndex: 2,
          }
        }}
      >
        <Box>
          <Typography variant="h6" gutterBottom>
            Edit Profile
          </Typography>
          
          {/* Profile Image Section with Hover Effect */}
          <Stack 
            direction="column" 
            spacing={2} 
            alignItems="center" 
            sx={{ mb: 2 }}
          >
            <Box 
              sx={{ width: 60, height: 60, position: 'relative' }}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              {avatar ? (
                <Avatar
                  src={avatar}
                  sx={{ width: '100%', height: '100%' }}
                  alt="Profile Image"
                />
              ) : (
                <Avatar sx={{ width: '100%', height: '100%' }}>
                  {currentUser.username[0].toUpperCase()}
                </Avatar>
              )}

              {/* Show EditIcon on hover */}
              {hover && (
                <EditIcon 
                  sx={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 3,
                    cursor: 'pointer',
                  }}
                  onClick={() => fileRef.current?.click()}
                />
              )}
            </Box>

            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setImage(e.target.files ? e.target.files[0] : undefined)}
              ref={fileRef}
              aria-label="Profile image upload"
            />
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
