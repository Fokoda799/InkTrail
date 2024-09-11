import axios from 'axios';
import { login } from '../redux/store';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Box, TextField, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

// Define types for state and form input
interface LoginInputs {
  email: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Initialize state with type
  const [inputs, setInputs] = useState<LoginInputs>({
    email: '',
    password: ''
  });

  // State to handle error messages
  const [error, setError] = useState<string>('');

  // Handle input change
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous errors
    setError('');

    // Encode the form data
    const formData = `${inputs.email}:${inputs.password}`;
    const encodedData = `Basic ${btoa(formData)}`; // Use btoa for Base64 encoding in the browser

    try {
      const { data } = await axios.get('/api/v1/user/login', {
        headers: {
          Authorization: encodedData
        }
      });

      if (data) {
        dispatch(login());
        alert('Login successful');
        navigate('/blogs');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        // Check if the error response exists and display the message
        setError(err.response?.data?.message || 'Failed to login');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        maxWidth={450}
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        margin='auto'
        marginTop={5}
        boxShadow='0 4px 8px rgba(0, 0, 0, 0.1)'
        padding={3}
        borderRadius={2}
      >
        <Typography variant='h4' gutterBottom>
          Login
        </Typography>

        {/* Display error messages */}
        {error && (
          <Typography color='error' variant='body2' gutterBottom>
            {error}
          </Typography>
        )}

        <TextField
          label='Email'
          name='email'
          value={inputs.email}
          onChange={handleOnChange}
          type='email'
          variant='outlined'
          fullWidth
          margin='normal'
          required
        />
        <TextField
          label='Password'
          name='password'
          value={inputs.password}
          onChange={handleOnChange}
          type='password'
          variant='outlined'
          fullWidth
          margin='normal'
          required
        />
        <Button
          type='submit'
          variant='contained'
          color='primary'
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Login
        </Button>
        <Typography
          variant='body2'
          sx={{ marginTop: 2 }}
        >
          Don’t have an account?{' '}
          <Link to='/register' style={{ textDecoration: 'none', color: '#1976d2' }}>
            Register
          </Link>
        </Typography>
      </Box>
    </form>
  );
}

export default Login;
