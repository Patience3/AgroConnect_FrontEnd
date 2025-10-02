import { createContext, useContext, useState, useEffect } from 'react';
import authService from '@/services/authService';
import { USER_ROLES } from '@/types';

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
    const { user: newUser } = await authService.register(userData);
    setUser(newUser);
    setIsAuthenticated(true);
    setCurrentRole(newUser.roles?.[0] || null);
    return newUser;
  };

  const login = async (credentials) => {
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

  const switchRole = async (role) => {
    await authService.switchRole(role);
    setCurrentRole(role);
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