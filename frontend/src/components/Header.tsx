import { Box, AppBar, Toolbar, Button, Typography, Tabs, Tab } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { logout } from '../redux/store';

const Header: React.FC = () => {
  // Get login state from Redux store
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Manage selected tab state
  const [value, setValue] = useState<number>(0);

  // Handle tab changes
  const handleTabChange = (_e: React.ChangeEvent<object>, newValue: number) => {
    setValue(newValue);
  };

  // Handle logout and navigation
  const handleLogoutClick = () => {
    dispatch(logout()); // Dispatch logout action
    navigate('/login'); // Navigate to login page
  };

  return (
    <AppBar position='sticky'>
      <Toolbar>
        <Typography variant='h4'>BlogiFY</Typography>
        {isLogin && (
          <Box display='flex' marginLeft='auto'>
            <Tabs
              textColor='inherit'
              value={value}
              onChange={handleTabChange}
            >
              <Tab label='Blogs' component={Link} to='/blogs' />
              <Tab label='My Blogs' component={Link} to='/myblogs' />
            </Tabs>
          </Box>
        )}
        <Box display='flex' marginLeft='auto'>
          {!isLogin ? (
            <>
              <Button
                sx={{ margin: 1, color: 'white' }}
                component={Link}
                to='/login'
              >
                Login
              </Button>
              <Button
                sx={{ margin: 1, color: 'white' }}
                component={Link}
                to='/register'
              >
                Register
              </Button>
            </>
          ) : (
            <Button
              sx={{ margin: 1, color: 'white' }}
              onClick={handleLogoutClick}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
