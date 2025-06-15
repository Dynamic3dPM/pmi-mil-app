import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Assignment,
  Message,
  Settings,
  Logout,
  School,
  TrendingUp,
  Person,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { getProfilePictureUrl } from '../../utils/linkedin';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user, signOut } = useAuth();
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (user) {
      // Get profile picture URL, which will check both direct URL and LinkedIn
      const picUrl = getProfilePictureUrl(user);
      setProfilePicture(picUrl);
    }
  }, [user]);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut();
    handleProfileMenuClose();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getMenuItems = () => {
    const commonItems = [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
      { text: 'Messages', icon: <Message />, path: '/messages' },
      { text: 'Settings', icon: <Settings />, path: '/settings' },
      { text: 'Profile', icon: <Person />, path: '/profile' },
    ];

    if (user?.userType === 'MILITARY_MEMBER') {
      return [
        ...commonItems.slice(0, 1), // Dashboard
        { text: 'My Progress', icon: <School />, path: '/progress' },
        { text: 'My Champion', icon: <People />, path: '/champion' },
        ...commonItems.slice(1), // Messages, Settings, Profile
      ];
    } else if (user?.userType === 'CHAMPION') {
      return [
        ...commonItems.slice(0, 1), // Dashboard
        { text: 'My Members', icon: <People />, path: '/members' },
        { text: 'Assignments', icon: <Assignment />, path: '/assignments' },
        { text: 'Reports', icon: <TrendingUp />, path: '/reports' },
        ...commonItems.slice(1), // Messages, Settings, Profile
      ];
    }

    return commonItems;
  };

  const menuItems = getMenuItems();

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          PMI Military Champions
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - 240px)` },
          ml: { md: '240px' },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {user?.userType === 'MILITARY_MEMBER' ? 'Military Member Portal' : 'Champion Portal'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
              {user?.firstName || 'User'} {user?.lastName || ''}
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: profilePicture ? 'transparent' : 'primary.main',
                  color: 'white'
                }}
                src={profilePicture || undefined}
                alt={`${user?.firstName || ''} ${user?.lastName || ''}`.trim()}
              >
                {!profilePicture && (
                  <>{user?.firstName?.[0]?.toUpperCase() || 'U'}{user?.lastName?.[0]?.toUpperCase() || ''}</>
                )}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
      >
        <MenuItem onClick={() => navigate('/profile')}>
          <Settings sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <Logout sx={{ mr: 1 }} />
          Sign Out
        </MenuItem>
      </Menu>

      <Box
        component="nav"
        sx={{ width: { md: 240 }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - 240px)` },
          mt: '64px',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
