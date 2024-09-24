import React, { useState, useEffect } from 'react';
import { AppProvider } from '@toolpad/core';
import OAuth from '../components/OAtuh';
import { Button, Typography, Box, Grid, Link, TextField, useTheme, CircularProgress } from '@mui/material';
import { signUp } from '../actions/userAction';
import { useNavigate, useLocation } from 'react-router-dom';
import { SuccessAlert, ErrorAlert } from '../components/Alert';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectUserState, clearError } from '../redux/reducers/userReducer';
import { useAlert } from 'react-alert';
import { SignUpData } from '../types/userTypes';

export default function SignUp() {
  const theme = useTheme();
  const [formData, setFormData] = useState<SignUpData>({} as SignUpData);
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Custom loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const alert = useAlert();
  const location = useLocation();

  interface Error {
    message: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setIsSubmitting(true); // Start loading on form submit
    try {
      await dispatch(signUp(formData)); // Dispatch sign-up action
      setSuccessAlert(true); // Show success alert on successful sign-up
    } catch (error: unknown) {
      const err = error as Error;
      setErrorAlert(err.message); // Handle error and show error alert
      setLoading(false); // Stop loading on error
    } finally {
      setLoading(false); // Stop loading after completion
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const { error, me } = useAppSelector(selectUserState);
  const redirect = location.search ? location.search.split('=')[1] : '/email-verification';

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearError());
    }

    if (me) {
      navigate(redirect);
      alert.success(`Welcome, ${me.username}! to InkTrail`);
    }
  }, [dispatch, error, alert, me, navigate, redirect]);

  return (
    <AppProvider theme={theme}>
      {successAlert && <SuccessAlert onClose={() => setSuccessAlert(false)} />}
      {errorAlert && <ErrorAlert message={errorAlert} onClose={() => setErrorAlert(null)} />}
      <Grid container justifyContent="center" sx={{ minHeight: '100vh', paddingBottom: '50px', }}>
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Box display="flex" flexDirection="column" alignItems="center" mt={4} px={3} py={4} boxShadow={3} borderRadius={2} bgcolor="white">
            <Typography variant="h5" component="h1" gutterBottom>
              Create an Account
            </Typography>
            <form style={{ width: '100%' }} onSubmit={handleSubmit}>
              <TextField
                label="Username"
                name="username"
                value={formData.username || ''}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                required
                margin="normal"
              />
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
                sx={{
                  mt: 2,
                  width: '100%',
                  backgroundColor: '#FFEB3B', // Yellow color
                  color: '#000',
                  '&:hover': {
                    backgroundColor: '#FDD835',
                  },
                }}
                disabled={isSubmitting || loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign Up'}
              </Button>
            </form>
            <OAuth />
            <Typography mt={3} variant="body1">
              Already have an account?{' '}
              <Link href="/signin" underline="hover">
                Sign in
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </AppProvider>
  );
}
