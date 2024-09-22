import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { Form, useLocation, useNavigate } from 'react-router-dom';

export default function Search() {
  const [term, setTerm] = React.useState('');
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const termURL = urlParams.get('term');
    if (termURL) {
      setTerm(termURL);
    }
  }, [location.search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('term', term);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <TextField
        variant="outlined" // Choose variant: "outlined", "filled", or "standard"
        placeholder="Search..."
        value={term}
        onChange={(e) => setTerm(e.target.value)} // Update term state on input change
        sx={{ width: 300 }} // Adjust the width as needed
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          sx: {
            height: 40, // Set the desired height
            '& .MuiInputBase-root': {
              padding: '0px', // Remove default padding
            },
            '& .MuiInputBase-input': {
              height: '100%', // Ensure input fills the TextField
              padding: '8px 0px', // Adjust padding for better alignment
            },
          },
        }}
      />
    </Form>
  );
}
