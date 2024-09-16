import { Box, Button, Typography, Stack, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { selectUserState } from '../redux/reducers/userReducer';
import BlogsPage from './BlogPage';

const LandingPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector(selectUserState);

  if (currentUser) {
    return <BlogsPage />;
  }

  const handleGetStarted = () => {
    navigate('/signup'); // Redirect to signup page
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url(https://source.unsplash.com/random/?writing,blog)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Container>
        <Box
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            padding: '40px',
            borderRadius: '10px',
            textAlign: 'center',
          }}
        >
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome to InkTrail
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Share your thoughts, discover new ideas, and create your own writing trail.
          </Typography>

          <Stack direction="column" spacing={2} alignItems="center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleGetStarted}
              sx={{
                backgroundColor: '#1976d2',
                padding: '10px 20px',
                fontSize: '18px',
                borderRadius: '30px',
                '&:hover': {
                  backgroundColor: '#115293',
                },
              }}
            >
              Get Started
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
