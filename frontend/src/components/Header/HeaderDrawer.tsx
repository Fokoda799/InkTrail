import React from 'react';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  Divider,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Stack } from '@mui/system';

function HeaderDrawer() {
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);
  const [isMobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const toggleMobileDrawer = (open: boolean) => {
    setMobileDrawerOpen(open);
  };

  const handleNotificationsClick = () => {
    console.log('Notifications clicked');
  };

  const handleProfile = () => {
    console.log('Profile clicked');
  };

  const handleSettings = () => {
    console.log('Settings clicked');
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const currentUser = { username: 'JohnDoe', avatar: null }; // Example user object

  const drawerList = (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem button onClick={handleProfile}>
          <ListItemIcon>
            <Avatar sx={{ width: 40, height: 40 }}>
              {currentUser?.username?.[0].toUpperCase() || ''}
            </Avatar>
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button onClick={handleSettings}>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  const mobileDrawerList = (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem button onClick={handleNotificationsClick}>
          <ListItemIcon>
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Notifications" />
        </ListItem>
        <Divider />
        <ListItem button onClick={handleProfile}>
          <ListItemIcon>
            <Avatar sx={{ width: 40, height: 40 }}>
              {currentUser?.username?.[0].toUpperCase() || ''}
            </Avatar>
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      {/* Main Menu Drawer */}
      <IconButton edge="start" color="inherit" onClick={() => toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="right" open={isDrawerOpen} onClose={() => toggleDrawer(false)}>
        {drawerList}
      </Drawer>

      {/* Mobile Menu Drawer */}
      <IconButton edge="start" color="inherit" onClick={() => toggleMobileDrawer(true)}>
        <MoreIcon />
      </IconButton>
      <Drawer anchor="left" open={isMobileDrawerOpen} onClose={() => toggleMobileDrawer(false)}>
        {mobileDrawerList}
      </Drawer>
    </div>
  );
}

export default HeaderDrawer;
