// src/context/AuthProvider.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import authService from '@/services/authService';
import { USER_ROLES } from '@/types';
import { DEVELOPMENT_MODE, getMockUser, MOCK_TOKEN, initDevMode } from '@/config/development';

const AuthContext = createContext(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      // Initialize development mode if enabled
      if (DEVELOPMENT_MODE && import.meta.env.MODE === 'development') {
        initDevMode();
      }

      const isAuth = authService.isAuthenticated();
      if (isAuth) {
        const userData = authService.getCurrentUser();
        const role = authService.getCurrentRole();
        
        setUser(userData);
        setCurrentRole(role || userData?.roles?.[0] || null);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const register = async (userData) => {
    // In dev mode, simulate registration
    if (DEVELOPMENT_MODE && import.meta.env.MODE === 'development') {
      const mockUser = getMockUser();
      setUser(mockUser);
      setIsAuthenticated(true);
      setCurrentRole(mockUser.roles?.[0] || null);
      return mockUser;
    }

    const { user: newUser } = await authService.register(userData);
    setUser(newUser);
    setIsAuthenticated(true);
    setCurrentRole(newUser.roles?.[0] || null);
    return newUser;
  };

  const login = async (credentials) => {
    // In dev mode, simulate login
    if (DEVELOPMENT_MODE && import.meta.env.MODE === 'development') {
      const mockUser = getMockUser();
      authService.setToken(MOCK_TOKEN);
      authService.setUser(mockUser);
      authService.setCurrentRole(mockUser.roles?.[0] || null);
      setUser(mockUser);
      setIsAuthenticated(true);
      setCurrentRole(mockUser.roles?.[0] || null);
      return mockUser;
    }

    const { user: loggedUser } = await authService.login(credentials);
    setUser(loggedUser);
    setIsAuthenticated(true);
    setCurrentRole(loggedUser.roles?.[0] || null);
    return loggedUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setCurrentRole(null);
    setIsAuthenticated(false);
  };

 // Update the switchRole function
const switchRole = async (role) => {
  try {
    // In development mode, just update local state
    if (DEVELOPMENT_MODE && import.meta.env.MODE === 'development') {
      authService.setCurrentRole(role);
      setCurrentRole(role);
      return;
    }
    
    // In production, call API
    await authService.switchRole(role);
    setCurrentRole(role);
  } catch (error) {
    console.error('Error switching role:', error);
    throw error;
  }
};

  const updateUser = (userData) => {
    setUser(userData);
    authService.setUser(userData);
  };
  

  const hasRole = (role) => user?.roles?.includes(role) || false;

  const value = {
    user,
    currentRole,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
    switchRole,
    updateUser,
    hasRole,
    isFarmer: hasRole(USER_ROLES.FARMER),
    isBuyer: hasRole(USER_ROLES.BUYER),
    isOfficer: hasRole(USER_ROLES.OFFICER),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;