import React, { useState } from 'react';
import { AppProvider } from '@toolpad/core';
import { Button, Typography, Box, Grid, Link, TextField, useTheme } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuthActions } from '../actions/userAction';
import { useNavigate } from 'react-router-dom';
import { SuccessAlert, ErrorAlert } from '../components/Alert';
import { FormData } from '../types/userTypes';

export default function SignIn() {
  const theme = useTheme();
  const [formData, setFormData] = useState<FormData>({} as FormData);
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { signIn } = useAuthActions(); // Correctly using the hook

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await signIn('credentials', formData);
    if (success) {
      setSuccessAlert(true);
      setErrorAlert(null); // Clear any existing errors
      navigate('/blogs'); // Redirect to a dashboard or home page
    } else {
      setErrorAlert('An error occurred. Please try again.');
      setSuccessAlert(false); // Clear any existing success alerts
    }
  };

  const handleGoogleSignIn = async () => {
    const success = await signIn('google');
    if (success) {
      setSuccessAlert(true);
      setErrorAlert(null); // Clear any existing errors
      navigate('/dashboard'); // Redirect to a dashboard or home page
    } else {
      setErrorAlert('An error occurred. Please try again.');
      setSuccessAlert(false); // Clear any existing success alerts
    }
  };

  return (
    <AppProvider theme={theme}>
      {successAlert && <SuccessAlert onClose={() => setSuccessAlert(false)} />}
      {errorAlert && <ErrorAlert message={errorAlert} onClose={() => setErrorAlert(null)} />}
      <Grid container justifyContent="center" sx={{ minHeight: '100vh', padding: 2 }}>
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Box display="flex" flexDirection="column" alignItems="center" mt={4} px={3} py={4} boxShadow={3} borderRadius={2}>
            <Typography variant="h5" component="h1" gutterBottom>
              Sign In
            </Typography>
            <form style={{ width: '100%' }} onSubmit={handleSubmit}>
              <TextField
                label="Email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                variant="outlined"
                type="email"
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Password"
                name="password"
                value={formData.password || ''}
                onChange={handleChange}
                type="password"
                variant="outlined"
                fullWidth
                required
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2, width: '100%' }}
              >
                Sign In
              </Button>
            </form>

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

            <Typography mt={3} variant="body1">
              Don’t have an account?{' '}
              <Link href="/signup" underline="hover">
                Sign up
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </AppProvider>
  );
}
