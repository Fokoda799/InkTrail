import React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
// import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Tabs, Tab, Tooltip } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { selectBlogState } from '../../redux/reducers/blogReducer';
import { logout } from '../../actions/userAction';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import { createBlog } from '../../actions/blogAction';
import NotificationsMenu from './NotificationsMenu';
import { User } from '../../types/userTypes';
import AccountMenu from './AccountMenu';
import SearchBar from '../SearchBar';
import { SxProps } from '@mui/material';
import { useAlert } from 'react-alert';
import { clearReadyBlog } from '../../redux/reducers/blogReducer';
import logo from '../../assets/logo.png';

// Define a constant for icon size
const iconSize = { width: 40, height: 40 };

interface HeaderProps {
  user: User | null;
  isAuthenticated: boolean;
}

const Header = ({user, isAuthenticated}: HeaderProps) => {
  const { readyBlog } = useAppSelector(selectBlogState);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const alert = useAlert();

  const navigate = useNavigate();
  const { pathname } = useLocation(); // Destructure pathname for cleaner code

  const isNotificationsOpen = Boolean(notificationsAnchorEl);

  // Memoized event handlers
  const handleProfileMenuOpen = React.useCallback((event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget), []);
  // const handleNotificationsClick = React.useCallback((event: React.MouseEvent<HTMLElement>) => setNotificationsAnchorEl(event.currentTarget), []);
  const handleMenuClose = React.useCallback(() => setAnchorEl(null), []);
  const handleNotificationsClose = React.useCallback(() => setNotificationsAnchorEl(null), []);
  const toggleDrawer = React.useCallback(
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
        return;
      }
      setDrawerOpen(open);
    },
    []
  );

  const handlePublish = () => {
    if (readyBlog) {
      console.log('Publishing blog:', readyBlog);
      dispatch(createBlog(readyBlog));
      navigate('/');
      alert.success("Blog published successfully");
      dispatch(clearReadyBlog());
    } else {
      console.error('No blog data to publish');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setAnchorEl(null);
  };

  // Avatar component
  const avatar = (user: User, sx: SxProps) => (
    <Avatar sx={sx} src={user.avatar || undefined}>
      {!user.avatar && user.username[0].toUpperCase()}
    </Avatar>
  );

  // Tabs for navigation
  const tabs = (
    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
      <Tabs>
        <Tooltip title="Go to Home" arrow>
          <Tab label="Home" component={Link} to="/" />
        </Tooltip>
        <Tooltip title="About Us" arrow>
          <Tab label="About" component={Link} to="/about" />
        </Tooltip>
        {pathname !== '/signin' && (
          <Tooltip title="Sign In" arrow>
            <Tab label="Sign In" component={Link} to="/signin" />
          </Tooltip>
        )}
        {pathname !== '/signup' && (
          <Tooltip title="Sign Up" arrow>
            <Tab label="Sign Up" component={Link} to="/signup" />
          </Tooltip>
        )}
      </Tabs>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1, borderBottom: 0.1, borderColor: 'gray' }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
        {/* Logo */}
        <img src={logo}
        alt="InkTrail"
        style={{ width: 80, height: 60, cursor: 'pointer', margin: 0 }}
        onClick={() => navigate('/')}
        />

        {/* Display ParentComponent only for logged-in users */}
        {isAuthenticated && user?.isVerified && <SearchBar />}

        {/* Display Tabs or User actions based on login state */}
        {isAuthenticated && user?.isVerified ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {pathname === '/new-fact' ? (
              <IconButton size="large" color="inherit" onClick={handlePublish}>
                <SendTwoToneIcon />
              </IconButton>
            ) : (
              <IconButton size="large" color="inherit" onClick={() => navigate('/new-fact')}>
                <HistoryEduIcon />
              </IconButton>
            )}
            <IconButton
              size="large"
              aria-label="open profile menu"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              {avatar(user, iconSize)}
            </IconButton>
          </Box>
        ) : (
          tabs
        )}

        {/* Mobile Drawer */}
        <IconButton
          size="large"
          aria-label="open drawer"
          onClick={toggleDrawer(true)}
          sx={{ display: { xs: 'flex', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            {isAuthenticated && user?.isVerified ? (
              <>
                <MenuItem>
                  {avatar(user, { width: 50, height: 50 })}
                  <Typography variant="body1" sx={{ marginLeft: 2 }}>{user?.username}</Typography>
                </MenuItem>
                <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                <MenuItem onClick={() => navigate('/settings')}>Settings</MenuItem>
              </>
            ) : (
              <>
                <MenuItem component={Link} to="/">Home</MenuItem>
                <MenuItem component={Link} to="/about">About</MenuItem>
                <MenuItem component={Link} to="/signin">Sign In</MenuItem>
                <MenuItem component={Link} to="/signup">Sign Up</MenuItem>
              </>
            )}
          </Box>
        </Drawer>
      </Toolbar>

      {/* Menu components */}
      <AccountMenu anchorEl={anchorEl} handleLogout={handleLogout} handleMenuClose={handleMenuClose} />
      <NotificationsMenu
        notificationsAnchorEl={notificationsAnchorEl}
        isNotificationsOpen={isNotificationsOpen}
        handleNotificationsClose={handleNotificationsClose}
      />
    </Box>
  );
};

export default Header;
