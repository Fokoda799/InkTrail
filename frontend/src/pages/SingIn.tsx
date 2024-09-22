import React, { useState, useEffect } from 'react';
import { AppProvider } from '@toolpad/core';
import OAuth from '../components/OAtuh';
import { Button, Typography, Box, Grid, Link, TextField, useTheme, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
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
  const [showPassword, setShowPassword] = useState(false);
  // const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const alert = useAlert();
  const location = useLocation();

  const { error, me, loading } = useAppSelector(selectUserState);
  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearError());
    }

    if (me) {
      navigate(redirect);
    }
  }, [dispatch, error, alert, me, navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable button during submission
    await dispatch(signIn(formData));
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  // const handleCloseSuccessAlert = (event?: Event | React.SyntheticEvent<unknown, Event>, reason?: string) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }
  //   setOpenSuccessAlert(false);
  // };


  return (
    <>
      <AppProvider theme={theme}>
        <Grid
          container
          justifyContent="center"
          sx={{ minHeight: '100vh', padding: 2, background: 'linear-gradient(135deg, #f5f5f5, #e0e0e0)', position: 'relative' }}
        >
          {/* Background Shapes */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: -1,
              backgroundImage: 'url(../../public/bg-shapes.svg)',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          />
          <Grid item xs={12} sm={8} md={6} lg={4}>
            <Box display="flex" flexDirection="column" alignItems="center" mt={4} px={3} py={4} boxShadow={3} borderRadius={2} bgcolor="white">
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
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {/* Yellow Sign-In Button */}
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
                  {loading ? <CircularProgress size={24} /> : 'Sign In'}
                </Button>
              </form>
              <Typography mt={3} variant="body1">
                <Link href="/forgot-password" underline="hover">
                  Forgot Password?
                </Link>
              </Typography>
              {/* Beautiful Google Button */}
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
      
    </>
  );
}
