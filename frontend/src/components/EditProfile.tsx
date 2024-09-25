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
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { getDownloadURL, getStorage, ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { app } from '../firebase';
import { updateUser } from '../actions/userAction';
import { useNavigate } from 'react-router-dom';

interface EditProfileProps {
  open: boolean;
  handleClose: () => void;
}

export default function EditProfile({ open, handleClose }: EditProfileProps) {
  const { user } = useAppSelector(selectUserState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  // State to manage hover and form inputs
  const [hover, setHover] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [image, setImage] = useState<File | null>(null);
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null); // Track uploaded file name

  // Pre-fill user data when component opens
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setBio(user.bio || '');
      setAvatar(user.avatar);
    }
  }, [user]);

  // Image upload effect
  useEffect(() => {
    if (image) {
      handleUploadImage(image);
    }
  }, [image]);

  const handleUploadImage = async (image: File) => {
    try {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + image.name;
      setUploadedFileName(fileName); // Track uploaded file name
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
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setAvatar(downloadURL);
        }
      );
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  // Handle image deletion from Firebase
  const handleDeleteImage = async () => {
    if (uploadedFileName) {
      try {
        const storage = getStorage(app);
        const storageRef = ref(storage, `avatars/${uploadedFileName}`);
        await deleteObject(storageRef);
        setAvatar(undefined);
        console.log('Image deleted successfully');
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    dispatch(updateUser({ username, bio, avatar }));
    handleClose();
    navigate('/profile');
  };

  // Handle cancel or close
  const handleCancel = () => {
    handleDeleteImage(); // Delete image if not saved
    handleClose();
  };

  if (!user) return null;

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
        onClose={handleCancel}
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
                  {user.username[0].toUpperCase()}
                </Avatar>
              )}

              {/* Show EditIcon on hover */}
              {hover && (
                <EditIcon 
                  sx={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '75%',
                    height: '75%',
                    padding: 1,
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
              onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
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
