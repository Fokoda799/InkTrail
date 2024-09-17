import { Box, Button, Typography, Container, Grid, Card, CardContent, useMediaQuery, Theme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { selectUserState } from '../redux/reducers/userReducer';
import BlogsPage from './BlogPage';
import { motion } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import ExploreIcon from '@mui/icons-material/Explore';
import CloudIcon from '@mui/icons-material/Cloud';
import React, { FC } from 'react';
import { SvgIconProps } from '@mui/material/SvgIcon';

interface FeatureCardProps {
  icon: React.ReactElement<SvgIconProps>;
  title: string;
  description: string;
}

const LandingPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector(selectUserState);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  if (currentUser) {
    return <BlogsPage />;
  }

  const handleGetStarted = () => {
    navigate('/signup');
  };
  
  const FeatureCard: FC<FeatureCardProps> = ({ icon, title, description }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 3 }}>
        <Box sx={{ marginBottom: 2 }}>{icon}</Box>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" align="center">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/blogify-auth-893b7.appspot.com/o/public%2Fpexels-pixabay-262508.jpg?alt=media&token=bf680b24-8292-4ea9-a0a1-87a8bffeae7d)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: { xs: '30px', md: '50px' },
                borderRadius: '10px',
                textAlign: 'center',
              }}
            >
              <Typography variant={isMobile ? 'h3' : 'h2'} gutterBottom sx={{ fontWeight: 'bold' }}>
                Welcome to InkTrail
              </Typography>
              <Typography variant={isMobile ? 'body1' : 'h5'} sx={{ mb: 4 }}>
                Share your thoughts, discover new ideas, and create your own writing trail.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleGetStarted}
                sx={{
                  backgroundColor: '#1976d2',
                  padding: '10px 30px',
                  fontSize: '18px',
                  borderRadius: '30px',
                  '&:hover': {
                    backgroundColor: '#115293',
                  },
                }}
              >
                Get Started
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, backgroundColor: '#f5f5f5' }}>
        <Container>
          <Typography variant="h3" align="center" gutterBottom>
            Why Choose InkTrail?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={4}>
              <FeatureCard
                icon={<EditIcon sx={{ fontSize: 60, color: '#1976d2' }} />}
                title="Express Yourself"
                description="Write and share your thoughts, stories, and ideas with our easy-to-use platform."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard
                icon={<ExploreIcon sx={{ fontSize: 60, color: '#1976d2' }} />}
                title="Discover Content"
                description="Explore a wide range of topics and find inspiration from other writers."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard
                icon={<CloudIcon sx={{ fontSize: 60, color: '#1976d2' }} />}
                title="Connect with Others"
                description="Build a network of like-minded individuals and engage in meaningful discussions."
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box sx={{ py: 8, backgroundColor: '#1976d2', color: 'white' }}>
        <Container>
          <Typography variant="h3" align="center" gutterBottom>
            Ready to Start Your Writing Journey?
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 4 }}>
            Join InkTrail today and become part of our growing community of writers and readers.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleGetStarted}
              sx={{
                padding: '10px 30px',
                fontSize: '18px',
                borderRadius: '30px',
              }}
            >
              Sign Up Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;