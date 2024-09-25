import React, { useState } from 'react';
import { motion } from 'framer-motion';
import OAuth from '../components/OAtuh';
import { Button, Typography, Box, Grid, Link, TextField, CircularProgress } from '@mui/material';
import { signUp } from '../actions/userAction';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectUserState } from '../redux/reducers/userReducer';
import { SignUpData } from '../types/userTypes';

interface Error {
  message: string;
}

export default function SignUp() {
  // Get loading and error state from redux
  const { isLoading, error } = useAppSelector(selectUserState);

  // Local state
  const [formData, setFormData] = useState<SignUpData>({} as SignUpData);
  // Dispatch and alert
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Submite form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(signUp(formData)); // Dispatch sign-up action
      navigate('/verify-email'); // Redirect to email verification page

    } catch (error: unknown) {
      const err = error as Error;
      console.log(err.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className='w-full bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
    overflow-hidden'
    >
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
              {error && <Typography color="error">{error}</Typography>}
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
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
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
    </motion.div>
  );
}
