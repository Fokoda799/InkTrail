import Button from '@mui/material/Button'
import GoogleIcon from '@mui/icons-material/Google'
import { useAppDispatch } from '../redux/hooks';
import { signInWithGoogle } from '../actions/userAction';

function OAtuh() {
  const dispatch = useAppDispatch();
  const handleGoogleSignIn = async () => {
    dispatch(signInWithGoogle());
  };

  return (
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
  )
}

export default OAtuh