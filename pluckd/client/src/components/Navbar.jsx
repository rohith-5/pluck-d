import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Typography, IconButton } from '@mui/material';
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
            mr: 4
          }}
        >
          pluck'd
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/order">
            Order
          </Button>
          <Button color="inherit" component={Link} to="/track">
            Track
          </Button>
          {user && (
            <>
              <Button color="inherit" component={Link} to="/my-orders">
                My Orders
              </Button>
              <Button color="inherit" component={Link} to="/profile">
                Profile
              </Button>
            </>
          )}
          {user?.role === 'ADMIN' && (
            <>
              <Button color="inherit" component={Link} to="/admin">
                Admin
              </Button>
              <Button color="inherit" component={Link} to="/admin/products">
                Products
              </Button>
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {user ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button 
                color="secondary" 
                variant="contained" 
                component={Link} 
                to="/register"
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
