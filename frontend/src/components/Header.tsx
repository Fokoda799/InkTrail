import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import BookTwoToneIcon from '@mui/icons-material/BookTwoTone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Tabs, Tab, Menu, Tooltip } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectUserState } from '../redux/reducers/userReducer';
import { selectBlogState } from '../redux/reducers/blogReducer';
import { logout } from '../actions/userAction';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import { createBlog } from '../actions/blogAction';
import Search from './Search';

function Header() {
  const { currentUser } = useAppSelector(selectUserState);
  const { readyBlog } = useAppSelector(selectBlogState);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isMenuOpen = Boolean(anchorEl);
  const isNotificationsOpen = Boolean(notificationsAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handlePublish = () => {
    if (readyBlog) {
      dispatch(createBlog(readyBlog));
      navigate('/');
    } else {
      console.error('No blog data to publish');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setAnchorEl(null);
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={() => setAnchorEl(null)}
    >
      <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
      <MenuItem onClick={() => navigate('/settings')}>Settings</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const renderNotificationsMenu = (
    <Menu
      anchorEl={notificationsAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isNotificationsOpen}
      onClose={handleNotificationsClose}
    >
      <MenuItem onClick={handleNotificationsClose}>Notification 1</MenuItem>
      <MenuItem onClick={handleNotificationsClose}>Notification 2</MenuItem>
      <MenuItem onClick={handleNotificationsClose}>Notification 3</MenuItem>
    </Menu>
  );

  const tabs = (
    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
      <Tabs>
        <Tooltip title="Go to Home" arrow>
          <Tab label="Home" component={Link} to="/" />
        </Tooltip>
        <Tooltip title="About Us" arrow>
          <Tab label="About" component={Link} to="/about" />
        </Tooltip>
        {location.pathname !== '/signin' && (
          <Tooltip title="Sign In" arrow>
            <Tab label="Sign In" component={Link} to="/signin" />
          </Tooltip>
        )}
        {location.pathname !== '/signup' && (
          <Tooltip title="Sign Up" arrow>
            <Tab label="Sign Up" component={Link} to="/signup" />
          </Tooltip>
        )}
      </Tabs>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to="/"
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <BookTwoToneIcon sx={{ width: 40, height: 40, marginRight: 1 }} />
          InkTrail
        </Typography>

        {currentUser && <Search />}

        {currentUser ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {location.pathname === '/new-fact' ? (
              <IconButton size="large" color="inherit" onClick={handlePublish}>
                <SendTwoToneIcon />
              </IconButton>
            ) : (
              <IconButton size="large" color="inherit" onClick={() => navigate('/new-fact')}>
                <HistoryEduIcon />
              </IconButton>
            )}
            <IconButton size="large" color="inherit" onClick={handleNotificationsClick}>
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" onClick={handleProfileMenuOpen} color="inherit">
              <Avatar sx={{ width: 40, height: 40 }}>{currentUser?.username?.[0].toUpperCase()}</Avatar>
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
          <MenuIcon/>
        </IconButton>

        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            {currentUser ? (
              <Box>
                <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                <MenuItem onClick={handleNotificationsClick}>
                  <Badge badgeContent={17} color="error">
                    <NotificationsIcon />
                  </Badge>
                    Notifications
                </MenuItem>
              </Box>
            ) : (
              <Box>
                <MenuItem component={Link} to="/">Home</MenuItem>
                <MenuItem component={Link} to="/about">About</MenuItem>
                <MenuItem component={Link} to="/signin">Sign In</MenuItem>
                <MenuItem component={Link} to="/signup">Sign Up</MenuItem>
              </Box>
            )}
          </Box>
        </Drawer>
      </Toolbar>
      {renderMenu}
      {renderNotificationsMenu}
    </Box>
  );
}

export default Header;
