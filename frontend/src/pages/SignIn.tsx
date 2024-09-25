import React, { useState } from 'react';
import { motion } from 'framer-motion';
import OAuth from '../components/OAtuh';
import { Button, Typography, Box, Grid, Link, TextField, CircularProgress } from '@mui/material';
import { signIn } from '../actions/userAction';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectUserState } from '../redux/reducers/userReducer';

export default function SignIn() {
  const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

	const { isLoading, error } = useAppSelector(selectUserState);
  const dispatch = useAppDispatch();

	const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await dispatch(signIn(email, password));
    setErrorMessage(error || "");
	};


  return (
    <motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className=''
		>
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
              <form style={{ width: '100%' }} onSubmit={handleSignin}>
                <TextField
                  label="Email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  type="email"
                  fullWidth
                  required
                  margin="normal"
                />
                <TextField
                  label="Password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                />

                {error && <Typography color="error">{errorMessage}</Typography>}
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
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
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
    </motion.div>
  );
}
