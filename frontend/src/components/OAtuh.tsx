import { useState } from 'react';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppDispatch } from '../redux/hooks';
import { signInWithGoogle } from '../actions/userAction';

function OAuth() {
  const [loading, setLoading] = useState(false); // Custom loading state
  const dispatch = useAppDispatch();

  const handleGoogleSignIn = async () => {
    setLoading(true); // Set loading to true when signing in
    try {
      await dispatch(signInWithGoogle()); // Dispatch Google sign-in action
      // Handle redirect or success here
    } catch (error) {
      // Handle any errors
      console.error(error);
      setLoading(false); // Stop loading if an error occurs
    }
  }

  return (
    <>
      {/* Check if loading is true to display the custom loading indicator */}
      {loading ? (
        <Button
          variant="contained"
          sx={{ 
            mt: 2, 
            width: '100%', 
            backgroundColor: '#db4437', // Google red
            color: 'white', // Text color
            '&:hover': {
              backgroundColor: '#c1351d', // Darker red for hover
            },
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center'
          }}
          disabled // Disable the button while loading
        >
          <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
          Signing in...
        </Button>
      ) : (
        <Button
          variant="contained"
          sx={{ 
            mt: 2, 
            width: '100%', 
            backgroundColor: '#db4437', // Google red
            color: 'white', // Text color
            '&:hover': {
              backgroundColor: '#c1351d', // Darker red for hover
            },
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={handleGoogleSignIn}
        >
          <GoogleIcon sx={{ mr: 1 }} />
          Continue with Google
        </Button>
      )}
    </>
  );
}

export default OAuth;
