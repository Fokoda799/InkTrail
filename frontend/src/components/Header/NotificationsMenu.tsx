import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import NotificationsIcon from '@mui/icons-material/Notifications';

interface NotificationsMenuProps {
  notificationsAnchorEl: null | HTMLElement;
  isNotificationsOpen: boolean;
  handleNotificationsClose: () => void;
}

const NotificationsMenu: React.FC<NotificationsMenuProps> = ({
  notificationsAnchorEl,
  isNotificationsOpen,
  handleNotificationsClose,
}) => {
  return (
    <Menu
      anchorEl={notificationsAnchorEl}
      id="notifications-menu"
      open={isNotificationsOpen}
      onClose={handleNotificationsClose}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
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
      <MenuItem onClick={handleNotificationsClose}>
        <ListItemIcon>
          <InfoIcon color="primary" />
        </ListItemIcon>
        <ListItemText primary="Notification 1" />
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleNotificationsClose}>
        <ListItemIcon>
          <WarningIcon color="warning" />
        </ListItemIcon>
        <ListItemText primary="Notification 2" />
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleNotificationsClose}>
        <ListItemIcon>
          <NotificationsIcon color="action" />
        </ListItemIcon>
        <ListItemText primary="Notification 3" />
      </MenuItem>
    </Menu>
  );
};

export default NotificationsMenu;
