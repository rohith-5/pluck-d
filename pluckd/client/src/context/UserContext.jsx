import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/auth/me', {
        withCredentials: true
      });
      setUser(response.data);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      if (error.response?.status === 401) {
        setError('Please login to continue');
        navigate('/login');
      } else {
        setError('Failed to check authentication status');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post('/api/auth/login', 
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await axios.post('/api/auth/register', 
        { name, email, password },
        { withCredentials: true }
      );
      setUser(response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await axios.post('/api/auth/logout', null, {
        withCredentials: true
      });
      setUser(null);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Logout failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ user, login, register, logout, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 