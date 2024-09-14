import Button from '@mui/material/Button'
import GoogleIcon from '@mui/icons-material/Google'
import { useAuthActions } from '../actions/userAction'
import { useNavigate } from 'react-router-dom'

function OAtuh() {
    const { signIn } = useAuthActions();
    const navigate = useNavigate();
    const handleGoogleSignIn = async () => {
        const success = await signIn('google');
        if (success) {
          navigate('/blogs'); // Redirect to a dashboard or home page
          alert('Google sign-in success');
        } else {
          alert('Google sign-in failed');
        }
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