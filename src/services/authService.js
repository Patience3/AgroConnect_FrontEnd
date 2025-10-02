import api from './api';
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const ROLE_KEY = 'current_role';

const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    const { token, user } = response.data;
    
    authService.setToken(token);
    authService.setUser(user);
    
    return { token, user };
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data;
    
    authService.setToken(token);
    authService.setUser(user);
    
    // Set default role if user has roles
    if (user.roles && user.roles.length > 0) {
      authService.setCurrentRole(user.roles[0]);
    }
    
    return { token, user };
  },

  // Logout
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ROLE_KEY);
    window.location.href = '/login';
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Update user data in storage
  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Get token
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Set token
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Check if authenticated
  isAuthenticated: () => {
    const token = authService.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired
      if (decoded.exp < currentTime) {
        authService.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  },

  // Verify phone
  verifyPhone: async (phoneNumber, otp) => {
    const response = await api.post('/auth/verify-phone', {
      phone_number: phoneNumber,
      otp,
    });
    return response.data;
  },

  // Resend OTP
  resendOTP: async (phoneNumber) => {
    const response = await api.post('/auth/resend-otp', {
      phone_number: phoneNumber,
    });
    return response.data;
  },

  // Request password reset
  requestPasswordReset: async (identifier) => {
    const response = await api.post('/auth/forgot-password', {
      identifier, // Can be phone or email
    });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', {
      token,
      password: newPassword,
    });
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/me');
    const user = response.data;
    authService.setUser(user);
    return user;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    const user = response.data;
    authService.setUser(user);
    return user;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  // Role management
  getCurrentRole: () => {
    return localStorage.getItem(ROLE_KEY);
  },

  setCurrentRole: (role) => {
    localStorage.setItem(ROLE_KEY, role);
  },

  switchRole: async (role) => {
    const response = await api.post('/auth/switch-role', { role });
    authService.setCurrentRole(role);
    return response.data;
  },

  // Add new role to user
  addRole: async (role, roleData) => {
    const response = await api.post('/auth/add-role', {
      role,
      ...roleData,
    });
    const user = response.data;
    authService.setUser(user);
    return user;
  },

  // Upload profile image
  uploadProfileImage: async (file) => {
    const response = await api.uploadFile('/auth/profile-image', file);
    return response.data;
  },
};

export default authService;