import React, { useState, useRef, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { InputBase, IconButton, Box, ListItemButton, Paper, List, ListItem, ListItemText, Divider, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { selectBlogState } from '../../redux/reducers/blogReducer';
import { sendQuery, fetchBlogById } from '../../actions/blogAction';
// import { useNavigate } from 'react-router-dom';
// import { clearBlog } from '../../redux/reducers/blogReducer';

// Color variable
const commonWhite = '#ffffff';

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

const DropdownContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  zIndex: 1,
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.primary.main}`,
  boxShadow: theme.shadows[3],
  marginTop: theme.spacing(1),
}));

// Main component
const Search = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const { items, selectedBlog } = useAppSelector(selectBlogState);
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle input change
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);

    if (event.target.value.trim() !== '') {
      setShowDropdown(true);
      await dispatch(sendQuery(event.target.value));
    } else {
      setShowDropdown(false);
    }
  };

  // Execute search
  const handleSearch = () => {
    onSearch(query);
    setShowDropdown(false);
  };

  // Handle item click
  const handleItemClick = (item: { id: string; title: string }) => {
    console.log('Clicked item:', item);
    dispatch(fetchBlogById(item.id)).then(() => {
      console.log('Dispatched fetchBlogById, current selectedBlog:', selectedBlog);
      setShowDropdown(false);
    });
  };

  // // Navigate when selectedBlog updates
  // useEffect(() => {
  //   console.log('selectedBlog updated:', selectedBlog);
  //   if (selectedBlog) {
  //     navigate(`/blog/${selectedBlog.author.username}/${selectedBlog._id}`);
  //     dispatch(clearBlog());
  //   }
  // }, [selectedBlog, navigate, dispatch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <SearchContainer>
      <SearchIconWrapper>
        <IconButton onClick={handleSearch} aria-label="search">
          <SearchIcon />
        </IconButton>
      </SearchIconWrapper>
      <StyledInputBase
        inputRef={inputRef}
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
      {showDropdown && (
        <DropdownContainer width={350}>
          <Paper>
            <List>
              <ListItem>
                <ListItemText primary={`Searching for "${query}"`} />
              </ListItem>
              <Divider />
              <Typography variant="body1" component="h2">
                Search Results
              </Typography>
              <Divider />
              {items?.length > 0 ? (
                items.map((item: { id: string; title: string }, index: number) => (
                  <div key={index}>
                    {/* Removed console.log and used correct syntax */}
                    <ListItemButton onClick={() => handleItemClick(item)}>
                      <ListItemText primary={item.title} />
                    </ListItemButton>
                    <Divider />
                  </div>
                ))
              ) : (
                <div>
                  <ListItem>
                    <ListItemText primary={`No results for "${query}"`} />
                  </ListItem>
                  <Divider />
                </div>
              )}
            </List>
          </Paper>
        </DropdownContainer>
      )}
    </SearchContainer>
  );
};

export default Search;
