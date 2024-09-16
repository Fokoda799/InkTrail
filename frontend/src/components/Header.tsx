import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Tabs, Tab, Stack } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectUserState } from '../redux/reducers/userReducer';
import { selectBlogState } from '../redux/reducers/blogReducer';
import { logout } from '../actions/userAction';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import { createBlog } from '../actions/blogAction';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
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

function Header() {
  const { currentUser } = useAppSelector(selectUserState);
  const { readyBlog } = useAppSelector(selectBlogState);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = React.useState<null | HTMLElement>(null);

  const navigate = useNavigate();
  const location = useLocation(); // Use the useLocation hook

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isNotificationsOpen = Boolean(notificationsAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleProfile = () => {
    navigate('/profile');
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleSettings = () => {
    navigate('/settings');
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/blogs');
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handlePublish = () => {
    if (readyBlog) {
      console.log(readyBlog);
      dispatch(createBlog(readyBlog));
      navigate('/');
    } else {
      console.error('No blog data to publish');
    }
  }

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
      <MenuItem onClick={handleProfile}>Profile</MenuItem>
      <MenuItem onClick={handleSettings}>Settings</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 17 new notifications" color="inherit" onClick={handleNotificationsClick}>
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton size="large" aria-label="account of current user" aria-controls={menuId} aria-haspopup="true" color="inherit">
          <Stack direction="row" spacing={1}>
            <Avatar sx={{ width: 60, height: 60 }}>
              {currentUser?.username?.[0].toUpperCase() || ''}
            </Avatar>
          </Stack>
        </IconButton>
        <p>Avatar</p>
      </MenuItem>
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

  // Conditionally render the Sign In and Sign Up tabs based on the current route
  const tabs = (
    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
      <Tabs aria-label="basic tabs example">
        <Tab label="Home" component={Link} to="/blogs" />
        <Tab label="About" component={Link} to="/about" />
        {location.pathname !== '/signin' && (
          <Tab label="Sign In" component={Link} to="/signin" />
        )}
        {location.pathname !== '/signup' && (
          <Tab label="Sign Up" component={Link} to="/signup" />
        )}
      </Tabs>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{ display: { xs: 'none', sm: 'block' }, color: 'inherit', textDecoration: 'none' }}
          >
            BlogiFY
          </Typography>
          {currentUser && (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
            </Search>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {currentUser ? (
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {location.pathname === '/new-fact' ? (
                <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
                onClick={handlePublish}
                >
                  <SendTwoToneIcon/>
                </IconButton>
              ) : (
                <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
                onClick={() => navigate('/new-fact')}
                >
                  <HistoryEduIcon/>
                </IconButton>
              )}
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
                onClick={handleNotificationsClick}
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Stack direction="row" spacing={1}>
                  {currentUser?.avatar ? (
                    <Avatar alt={currentUser.username} src={currentUser.avatar} />
                  ) : (
                    <Avatar sx={{ width: 60, height: 60 }}>
                      {currentUser.username?.[0].toUpperCase() || ''}
                    </Avatar>
                  )}
                </Stack>
              </IconButton>
            </Box>
          ) : (
            tabs
          )}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {renderNotificationsMenu}
    </Box>
  );
}

export default Header;
