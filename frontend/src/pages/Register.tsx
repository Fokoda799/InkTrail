import { Typography, Box, TextField, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // Corrected import
import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [inputs, setInputs] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    conPassword: ''
  });

  const navigate = useNavigate(); // Hook to navigate to other pages
  const [error, setError] = useState<string>(''); // State to handle error messages

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputs.password !== inputs.conPassword) {
      setError('Passwords do not match');
      return;
    }

    // Clear the error and proceed with form submission
    setError('');
    console.log(inputs);

    // Make a POST request to the server
    try {
      const { data } = await axios.post('/api/v1/user/register', {
        full_name: inputs.fullName,
        username: inputs.username,
        email: inputs.email,
        password: inputs.password
      });

      if (data) {
        alert('Registration successful');
        navigate('/blogs'); // Navigate to login after successful registration
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || 'Failed to register');
      } else {
        setError('An unexpected error occurred');
      }
      console.error(err);
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
          Register
        </Typography>

        {/* Error message display */}
        {error && (
          <Typography color='error' variant='body2' gutterBottom>
            {error}
          </Typography>
        )}

        <TextField
          label='Full name (Optional)'
          name='fullName'
          value={inputs.fullName}
          variant='outlined'
          onChange={handleOnChange}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Username'
          name='username'
          value={inputs.username}
          variant='outlined'
          onChange={handleOnChange}
          fullWidth
          margin='normal'
          required
        />
        <TextField
          label='Email'
          name='email'
          value={inputs.email}
          type='email'
          variant='outlined'
          onChange={handleOnChange}
          fullWidth
          margin='normal'
          required
        />
        <TextField
          label='Password'
          name='password'
          value={inputs.password}
          type='password'
          variant='outlined'
          onChange={handleOnChange}
          fullWidth
          margin='normal'
          required
        />
        <TextField
          label='Confirm Password'
          name='conPassword'
          value={inputs.conPassword}
          type='password'
          variant='outlined'
          onChange={handleOnChange}
          fullWidth
          margin='normal'
          required
        />
        <Button
          variant='contained'
          color='primary'
          fullWidth
          sx={{ marginTop: 2 }}
          type='submit'
        >
          Submit
        </Button>

        <Typography variant='body2' sx={{ marginTop: 2 }}>
          Already have an account?{' '}
          <Link to='/login' style={{ textDecoration: 'none', color: '#1976d2' }}>
            Login
          </Link>
        </Typography>
      </Box>
    </form>
  );
}

export default Register;
