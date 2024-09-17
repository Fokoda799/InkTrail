import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound = () => {
  return (
    <Container component="main" maxWidth="sm" sx={{ textAlign: 'center', mt: 10, marginBottom: 10 }}>
      <ErrorOutlineIcon sx={{ fontSize: 100, color: 'error.main' }} />
      <Typography variant="h2" color="text.primary" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" color="text.secondary" paragraph>
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        It looks like you may have taken a wrong turn. Don't worry... it happens to the best of us.
      </Typography>

      <Box mt={4} >
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/" 
          sx={{ textTransform: 'none' }}
        >
          Go Back Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
