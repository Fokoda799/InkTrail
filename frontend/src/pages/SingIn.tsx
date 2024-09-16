import React, { useState, useEffect } from 'react';
import { AppProvider } from '@toolpad/core';
import OAuth from '../components/OAtuh';
import { Button, Typography, Box, Grid, Link, TextField, useTheme, CircularProgress } from '@mui/material';
import { signIn } from '../actions/userAction';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectUserState, clearError } from '../redux/reducers/userReducer';
import { useAlert } from 'react-alert';
import { SignInData } from '../types/userTypes';

export default function SignIn() {
  const theme = useTheme();
  const [formData, setFormData] = useState<SignInData>({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const alert = useAlert();
  const location = useLocation();

  const { error, currentUser, loading } = useAppSelector(selectUserState);
  const redirect = location.search ? location.search.split("=")[1] : "/profile";

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearError());
    }

    if (currentUser) {
      navigate(redirect);
    }
  }, [dispatch, error, alert, currentUser, navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable button during submission
    await dispatch(signIn(formData));
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <AppProvider theme={theme}>
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
                value={formData.email}
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
                value={formData.password}
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
                disabled={isSubmitting || loading} // Disable when submitting or loading
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
            </form>
            <Typography mt={3} variant="body1">Or</Typography>
            <OAuth />
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
