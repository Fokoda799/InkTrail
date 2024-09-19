// src/components/Search.tsx
import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Define static colors for styling
const commonWhite = '#ffffff'; // You can replace this with your own color or a hex code

// Styled components
const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(commonWhite, 0.15),
  '&:hover': {
    backgroundColor: alpha(commonWhite, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

// Component
const Search = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <SearchContainer>
      <SearchIconWrapper>
        <IconButton onClick={handleSearch} aria-label="search">
          <SearchIcon />
        </IconButton>
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ 'aria-label': 'search' }}
        value={query}
        onChange={handleChange}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            handleSearch();
          }
        }}
      />
    </SearchContainer>
  );
};

export default Search;
