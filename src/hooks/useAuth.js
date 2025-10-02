import { useState, useEffect, useCallback } from 'react';
import authService from '@/services/authService';
import { USER_ROLES } from '@/types';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const isAuth = authService.isAuthenticated();
        setIsAuthenticated(isAuth);

        if (isAuth) {
          const userData = authService.getCurrentUser();
          const role = authService.getCurrentRole();
          
          setUser(userData);
          setCurrentRole(role || (userData?.roles?.[0] || null));
        }
      } catch (err) {
        console.error('Error loading user:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register
  const register = useCallback(async (userData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const { user: newUser, token } = await authService.register(userData);
      
      setUser(newUser);
      setIsAuthenticated(true);
      setCurrentRole(newUser.roles?.[0] || null);
      
      return { user: newUser, token };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login
  const login = useCallback(async (credentials) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const { user: loggedUser, token } = await authService.login(credentials);
      
      setUser(loggedUser);
      setIsAuthenticated(true);
      setCurrentRole(loggedUser.roles?.[0] || null);
      
      return { user: loggedUser, token };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setCurrentRole(null);
    setIsAuthenticated(false);
  }, []);

  // Switch role
  const switchRole = useCallback(async (role) => {
    try {
      setError(null);
      await authService.switchRole(role);
      setCurrentRole(role);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (profileData) => {
    try {
      setError(null);
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      setError(null);
      const userData = await authService.getProfile();
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return user?.roles?.includes(role) || false;
  }, [user]);

  // Check if user is farmer
  const isFarmer = useCallback(() => {
    return hasRole(USER_ROLES.FARMER);
  }, [hasRole]);

  // Check if user is buyer
  const isBuyer = useCallback(() => {
    return hasRole(USER_ROLES.BUYER);
  }, [hasRole]);

  // Check if user is officer
  const isOfficer = useCallback(() => {
    return hasRole(USER_ROLES.OFFICER);
  }, [hasRole]);

  return {
    user,
    currentRole,
    isAuthenticated,
    isLoading,
    error,
    register,
    login,
    logout,
    switchRole,
    updateProfile,
    refreshUser,
    hasRole,
    isFarmer,
    isBuyer,
    isOfficer,
  };
};

export default useAuth;