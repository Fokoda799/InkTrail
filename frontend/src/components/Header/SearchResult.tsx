import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { Typography } from '@mui/material';
import { createPortal } from 'react-dom';

interface SearchResultProps {
  query: string;
  open: boolean;
  handleClose: () => void;
}

const SearchResult = ({ query, open, handleClose }: SearchResultProps) => {
  // Use createPortal to render the Menu outside the normal DOM hierarchy
  return createPortal(
    <Menu
      anchorEl={document.getElementById('search-container')}
      id="search-result"
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem onClick={handleClose}>
        <Typography variant="body1">Search results for "{query}"</Typography>
      </MenuItem>
      <Divider />
    </Menu>,
    document.body // Portal destination
  );
};

export default SearchResult;
